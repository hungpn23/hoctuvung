import { JwtPayload, RequestUser } from "@common";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Payload = createParamDecorator(
	(data: keyof JwtPayload | undefined, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<RequestUser>();
		const user = request.user; // user is set in the AuthGuard

		return data ? user?.[data] : user;
	},
);
