import { User } from '@api/user/entities/user.entity';
import { JwtPayload, RefreshTokenPayload } from '@common/types/auth.type';
import { Milliseconds, UUID } from '@common/types/branded.type';
import {
  GoogleJwtPayload,
  GoogleTokenResponse,
} from '@common/types/google.type';
import { AllConfig } from '@config';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import type { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import crypto from 'crypto';
import { Response } from 'express';
import ms from 'ms';
import { generateFromEmail } from 'unique-username-generator';
import { Session } from './../user/entities/session.entity';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  TokenPairDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService<AllConfig, true>,
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(Session)
    private readonly sessionRepository: EntityRepository<Session>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  // redirect to oauth consent screen
  googleRedirect(res: Response) {
    const options = {
      redirect_uri: this.configService.get('google.redirectUri', {
        infer: true,
      }),
      client_id: this.configService.get('google.clientId', { infer: true }),
      response_type: 'code',
      scope: 'profile email',
      prompt: 'select_account',
    };

    const searchParams = new URLSearchParams(options);

    const url =
      'https://accounts.google.com/o/oauth2/v2/auth?' + searchParams.toString();

    res.redirect(url);
  }

  async googleLogin(code: string, res: Response) {
    const appHost = this.configService.get('app.host', { infer: true });
    const appPort = this.configService.get('app.port', { infer: true });
    const params = new URLSearchParams({
      code,
      client_id: this.configService.get('google.clientId', { infer: true }),
      client_secret: this.configService.get('google.clientSecret', {
        infer: true,
      }),
      redirect_uri: this.configService.get('google.redirectUri', {
        infer: true,
      }),
      grant_type: 'authorization_code',
    }).toString();

    const response = await fetch(
      'https://oauth2.googleapis.com/token?' + params,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const data = (await response.json()) as GoogleTokenResponse;
    const { email, email_verified } = this.jwtService.decode<GoogleJwtPayload>(
      data.id_token,
    );

    let user = await this.userRepository.findOne({ email });
    if (!user) {
      user = this.userRepository.create({
        username: generateFromEmail(email, 3),
        email,
        emailVerified: email_verified,
        password: '',
      });
    }

    const tokenPair = await this.createTokenPair(user);
    const oneTimeCode = crypto.randomBytes(20).toString('hex');

    await this.cacheManager.set(
      `one_time_code:${oneTimeCode}`,
      tokenPair,
      (60 * 1000) as Milliseconds,
    );

    await this.em.flush();

    return res.redirect(
      `http://${appHost}:${appPort}/login/callback?code=${oneTimeCode}`,
    );
  }

  async exchangeOneTimeCodeForTokens(code: string) {
    const cacheKey = `one_time_code:${code}`;
    const tokenPair = await this.cacheManager.get<TokenPairDto>(cacheKey);

    if (!tokenPair) throw new UnauthorizedException('Invalid or expired code.');

    await this.cacheManager.del(cacheKey);

    return plainToInstance(TokenPairDto, tokenPair);
  }

  async register(dto: RegisterDto) {
    const { username, password, confirmPassword } = dto;
    const user = await this.userRepository.findOne({ username });

    if (user) throw new BadRequestException('Username already exists');

    if (password !== confirmPassword)
      throw new BadRequestException('Passwords do not match');

    const newUser = this.userRepository.create({ username, password });

    const tokenPair = await this.createTokenPair(newUser);

    await this.em.flush();

    return plainToInstance(TokenPairDto, tokenPair);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ username: dto.username });

    const isValid = user && (await argon2.verify(user.password, dto.password));
    if (!isValid) throw new BadRequestException('Invalid credentials');

    const tokenPair = await this.createTokenPair(user);

    await this.em.flush();

    return plainToInstance(TokenPairDto, tokenPair);
  }

  async logout(payload: JwtPayload) {
    const { sessionId, exp, userId } = payload;
    await this.cacheManager.set<boolean>(
      `session_blacklist:${userId}:${sessionId}`,
      true,
      (exp! * 1000 - Date.now()) as Milliseconds,
    );

    const session = await this.sessionRepository.findOne(sessionId);
    if (!session) throw new BadRequestException();

    return await this.em.removeAndFlush(session);
  }

  async refreshToken({ sessionId, signature, userId }: RefreshTokenPayload) {
    const session = await this.sessionRepository.findOne(sessionId, {
      populate: ['user'],
    });

    if (!session) throw new UnauthorizedException();

    if (session?.signature !== signature) {
      this.logger.debug(
        `Refresh token reuse detected for user ${userId}, revoking all sessions`,
      );

      const sessions = await this.sessionRepository.find({
        user: { id: userId },
      });
      await this.em.removeAndFlush(sessions);
      throw new UnauthorizedException();
    }

    const newSignature = this.createSignature();

    const jwtPayload: JwtPayload = {
      userId: session.user.id,
      sessionId,
      role: session.user.getProperty('role'),
    };

    const refreshTokenPayload = {
      ...jwtPayload,
      signature: newSignature,
    };

    this.sessionRepository.assign(session, {
      signature: newSignature,
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('auth.jwtSecret', { infer: true }),
        expiresIn: this.configService.get('auth.jwtExpiresIn', {
          infer: true,
        }),
      }),

      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.get('auth.refreshTokenSecret', {
          infer: true,
        }),
        expiresIn: this.configService.get('auth.refreshTokenExpiresIn', {
          infer: true,
        }),
      }),

      this.em.flush(),
    ]);

    return plainToInstance(TokenPairDto, { accessToken, refreshToken });
  }

  async changePassword(userId: UUID, dto: ChangePasswordDto) {
    const { oldPassword, newPassword, confirmPassword } = dto;

    if (newPassword !== confirmPassword)
      throw new BadRequestException('Passwords do not match');

    const user = await this.userRepository.findOne(userId);
    if (!user) throw new BadRequestException();

    const isOldPasswordValid = await argon2.verify(user.password, oldPassword);
    if (!isOldPasswordValid)
      throw new BadRequestException('Invalid credentials');

    const isSamePassword = await argon2.verify(user.password, newPassword);
    if (isSamePassword)
      throw new BadRequestException(
        'New password must be different from current password',
      );

    this.userRepository.assign(user, { password: newPassword });

    return await this.em.flush();
  }

  async verifyAccessToken(accessToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('auth.jwtSecret', { infer: true }),
      });
    } catch (_) {
      throw new UnauthorizedException('Invalid token');
    }

    const { userId, sessionId } = payload;
    const isInBlacklist = await this.cacheManager.get<boolean>(
      `session_blacklist:${userId}:${sessionId}`,
    );

    if (isInBlacklist) {
      const sessions = await this.sessionRepository.find({
        user: { id: userId },
      });
      await this.em.removeAndFlush(sessions);
      throw new UnauthorizedException();
    }

    return payload;
  }

  async verifyRefreshToken(refreshToken: string) {
    let payload: RefreshTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('auth.refreshTokenSecret', {
          infer: true,
        }),
      });
    } catch (_) {
      const payload = this.jwtService.decode<RefreshTokenPayload | null>(
        refreshToken,
      );

      if (payload?.sessionId) {
        const expiredSession = await this.sessionRepository.findOne(
          payload.sessionId,
        );
        if (expiredSession) {
          await this.em.removeAndFlush(expiredSession);
        }
      }

      throw new UnauthorizedException('Session expired');
    }

    return payload;
  }

  private async createTokenPair(user: User) {
    const refreshTokenExpiresIn = this.configService.get(
      'auth.refreshTokenExpiresIn',
      { infer: true },
    );

    const signature = this.createSignature();

    const newSession = this.sessionRepository.create({
      signature,
      user,
      expiresAt: new Date(Date.now() + ms(refreshTokenExpiresIn)),
    });

    const jwtPayload: JwtPayload = {
      userId: user.id,
      sessionId: newSession.id,
      role: user.role,
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      ...jwtPayload,
      signature,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('auth.jwtSecret', { infer: true }),
        expiresIn: this.configService.get('auth.jwtExpiresIn', {
          infer: true,
        }),
      }),

      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.get('auth.refreshTokenSecret', {
          infer: true,
        }),
        expiresIn: refreshTokenExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private createSignature() {
    return crypto.randomBytes(16).toString('hex');
  }
}
