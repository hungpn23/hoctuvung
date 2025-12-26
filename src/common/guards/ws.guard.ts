import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'ws') return true;

    const client = context.switchToWs().getClient<Socket>();
    const { authorization } = client.handshake.headers;

    Logger.log(`WebSocket Authorization: ${authorization}`, WsGuard.name);

    throw new WsException({ message: 'Unauthorized' });

    return false;
  }
}
