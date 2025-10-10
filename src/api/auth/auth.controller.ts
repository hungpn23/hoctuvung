import {
  ApiEndpoint,
  ApiPublicEndpoint,
} from '@common/decorators/api-endpoint.decorator';
import { RefreshToken } from '@common/decorators/auth/refresh-token.decorator';
import { Payload } from '@common/decorators/jwt-payload.decorator';
import type { JwtPayload, RefreshTokenPayload } from '@common/types/auth.type';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  TokenPairDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPublicEndpoint()
  @Get('google')
  googleRedirect(@Res() res: Response) {
    return this.authService.googleRedirect(res);
  }

  @ApiPublicEndpoint()
  @Get('google/callback')
  async googleLogin(@Query('code') code: string, @Res() res: Response) {
    return await this.authService.googleLogin(code, res);
  }

  @ApiPublicEndpoint({ type: TokenPairDto })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @ApiPublicEndpoint({ type: TokenPairDto })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @ApiEndpoint()
  @Post('logout')
  async logout(@Payload() payload: JwtPayload) {
    return await this.authService.logout(payload);
  }

  @RefreshToken()
  @ApiEndpoint({ type: TokenPairDto })
  @Post('refresh-token')
  async refreshToken(@Payload() payload: RefreshTokenPayload) {
    return await this.authService.refreshToken(payload);
  }

  @ApiEndpoint()
  @Post('password/change')
  async changePassword(
    @Payload() { userId }: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(userId, dto);
  }

  // TODO: auth api
  // @Post('forgot-password')
  // async forgotPassword() {
  //   return 'forgot-password';
  // }

  // @Post('verify/forgot-password')
  // async verifyForgotPassword() {
  //   return 'verify-forgot-password';
  // }

  // @Get('verify/email')
  // async verifyEmail() {
  //   return 'verify-email';
  // }

  // @Post('verify/email/resend')
  // async resendVerifyEmail() {
  //   return 'resend-verify-email';
  // }
}
