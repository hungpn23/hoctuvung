import { AuthService } from '@api/auth/auth.service';
import { MetadataKey } from '@common/constants/metadata.enum';
import { RequestUser } from '@common/types/auth.type';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestUser>();

    const hasPublicDecorator = this.reflector.getAllAndOverride<boolean>(
      MetadataKey.PUBLIC_ROUTE,
      [context.getClass(), context.getHandler()],
    );

    const accessToken = this._extractTokenFromHeader(request);

    if (hasPublicDecorator) {
      request.user = await this.authService
        .verifyAccessToken(accessToken)
        .catch(() => undefined);

      return true;
    }

    request.user = await this.authService.verifyAccessToken(accessToken);

    return true;
  }

  private _extractTokenFromHeader(request: ExpressRequest) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }
}
