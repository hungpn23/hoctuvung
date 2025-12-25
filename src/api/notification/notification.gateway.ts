import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DefaultEventsMap, Server } from 'socket.io';
import { NotificationDto } from './notification.dto';
import { ServerToClientEvents } from './notification.interface';

@WebSocketGateway({ namespace: 'notifications' })
export class NotificationGateway {
  private readonly logger = new Logger(NotificationGateway.name);

  /**
   * \@WebSocketServer() decorator injects a server instance by referencing the metadata stored by the \@WebSocketGateway() decorator.
   * If you provide the namespace option to the \@WebSocketGateway() decorator, \@WebSocketServer() decorator returns a Namespace instance instead of a Server instance.
   * @see https://docs.nestjs.com/websockets/gateways#server-and-namespace
   * @bugOrNot A bug?: In this case, it also returns Server instance even though we have namespace configured. And it works as expected (namespace usage won't fit my use case).
   */
  @WebSocketServer()
  private readonly server!: Server<DefaultEventsMap, ServerToClientEvents>;

  constructor() {}

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    return data;
  }

  sendNotification(payload: NotificationDto) {
    this.server.emit('notificationAdded', payload);
  }
}
