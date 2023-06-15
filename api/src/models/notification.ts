import { NotificationEntity } from "../entity/notification.entity";
import { ValidationUtils } from "../utils/validationUtils";

export interface Notification {
    id: number;
    userId: number | null;
    text: string;
    read: boolean;
}

export class NotificationParser {
    public static parseNotification(
        notificationEntity: NotificationEntity
    ): Notification {
        return {
            id: notificationEntity.Id,
            userId: ValidationUtils.isNull(notificationEntity.User)
                ? null
                : notificationEntity.User.Id,
            text: notificationEntity.Text,
            read: notificationEntity.ReadAt !== null,
        };
    }

    public static parseNotifications(
        notificationEntities: NotificationEntity[]
    ): Notification[] {
        return notificationEntities.map(NotificationParser.parseNotification);
    }
}
