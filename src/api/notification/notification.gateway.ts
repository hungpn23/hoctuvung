import type { SocketUser } from "@common/types/auth.type";
import { Logger } from "@nestjs/common";
import {
	type OnGatewayConnection,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import type { DefaultEventsMap, Server } from "socket.io";
import type { NotificationDto } from "./notification.dto";
import type { ServerToClientEvents } from "./notification.interface";

@WebSocketGateway({
	namespace: "notifications",
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
	},
})
export class NotificationGateway implements OnGatewayConnection {
	private readonly logger = new Logger(NotificationGateway.name);

	/**
	 * \@WebSocketServer() decorator injects a server instance by referencing the metadata stored by the \@WebSocketGateway() decorator.
	 * If you provide the namespace option to the \@WebSocketGateway() decorator, \@WebSocketServer() decorator returns a Namespace instance instead of a Server instance.
	 * @see https://docs.nestjs.com/websockets/gateways#server-and-namespace
	 * @bugOrNot A bug?: In this case, it also returns Server instance even though we have namespace configured. And it works as expected (namespace usage won't fit my use case).
	 */
	@WebSocketServer()
	private readonly server!: Server<DefaultEventsMap, ServerToClientEvents>;

	async handleConnection(socket: SocketUser) {
		const userId = socket.user.userId;
		this.logger.debug(`Socket connected: ${socket.id} for User: ${userId}`);

		await socket.join(userId);

		this.server
			.to(userId)
			.emit("socketConnected", "Welcome to Notification Service!");
	}

	sendNotification(payload: NotificationDto) {
		this.server.emit("notificationAdded", payload);
	}
}
