import type { NotificationDto } from "./notification.dto";

export interface ServerToClientEvents {
	socketConnected: (message: string) => void;
	notificationAdded: (payload: NotificationDto) => void;
}
