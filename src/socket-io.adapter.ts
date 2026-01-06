import type { AuthService } from "@api/auth/auth.service";
import type { SocketUser } from "@common/types/auth.type";
import {
	type INestApplication,
	Logger,
	type UnauthorizedException,
} from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import type { ExtendedError, Server, ServerOptions, Socket } from "socket.io";

export class SocketIOAdapter extends IoAdapter {
	private readonly logger = new Logger(SocketIOAdapter.name);

	constructor(
		private readonly app: INestApplication,
		private readonly authService: AuthService,
	) {
		super(app);
	}

	createIOServer(port: number, options?: ServerOptions) {
		const server = super.createIOServer(port, options) as Server;

		server
			.of("notifications")
			.use((socket: Socket, next: (err?: ExtendedError) => void) => {
				this.authService
					.verifyAccessToken(socket.handshake.headers["authorization"])
					.then((payload) => {
						(socket as SocketUser).user = payload;
						next();
					})
					.catch((ex: UnauthorizedException) => {
						const error: ExtendedError = new Error(ex.message);
						error.data = ex.getResponse();

						next(error);
					});
			});

		return server;
	}
}
