import { NotificationDto } from './notification.dto';

export interface ServerToClientEvents {
  ['notificationAdded']: (payload: NotificationDto) => void;
}
