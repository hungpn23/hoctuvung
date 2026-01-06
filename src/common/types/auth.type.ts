import type { UserRole } from "@common/constants/role.enum";
import type { Request as ExpressRequest } from "express";
import type { Socket } from "socket.io";
import type { Seconds, UUID } from "./branded.type";

type BaseJwtPayload = {
	sessionId: UUID;
	exp?: Seconds;
};

export type JwtPayload = BaseJwtPayload & { userId: UUID; role: UserRole };
export type RefreshTokenPayload = JwtPayload & { signature: string };
export type RequestUser = ExpressRequest & {
	user?: JwtPayload;
};

export type SocketUser = Socket & {
	user: JwtPayload;
};
