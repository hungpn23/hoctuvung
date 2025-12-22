import { UserRole } from '@common/constants/role.enum';
import { Request as ExpressRequest } from 'express';
import { Seconds, UUID } from './branded.type';

type BaseJwtPayload = {
  sessionId: UUID;
  exp?: Seconds | null;
};

export type JwtPayload = BaseJwtPayload & { userId: UUID; role: UserRole };
export type RefreshTokenPayload = JwtPayload & { signature: string };
export type RequestUser = ExpressRequest & {
  user?: JwtPayload;
};
