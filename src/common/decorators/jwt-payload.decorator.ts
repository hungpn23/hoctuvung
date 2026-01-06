import type { JwtPayload, RequestUser } from "@common/types/auth.type";
import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

export const Payload = createParamDecorator(
	(data: keyof JwtPayload | undefined, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<RequestUser>();
		const user = request.user; // user is set in the AuthGuard

		return data ? user?.[data] : user;
	},
);
