import { RequestUser } from '@common/types/auth.type';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Payload = createParamDecorator(
  (_data: string, context: ExecutionContext) => {
    return context.switchToHttp().getRequest<RequestUser>().user; // user is set in the AuthGuard
  },
);
