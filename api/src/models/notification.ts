import { NotificationEntity } from "../entity/notification.entity";
import { ValidationUtils } from "../utils/validationUtils";

export interface Notification {
    id: number;
    userId: number | null;
    text: string;
    read: boolean;
}

export class NotificationParser {
    public static parseNotification(notificationEntity: any): Notification {
        if (ValidationUtils.isNull(notificationEntity)) {
            return {} as Notification;
        }

        const notification = {
            id: notificationEntity.Id,
            userId: ValidationUtils.isNull(notificationEntity.User)
                ? null
                : notificationEntity.User.Id,
            text: notificationEntity.Text,
            read: !ValidationUtils.isNull(notificationEntity.ReadAt),
        };

        Object.keys(notification).forEach(
            (key) =>
                ValidationUtils.isNull(notification[key]) &&
                delete notification[key]
        );

        return notification;
    }

    public static parseNotifications(
        notificationEntities: NotificationEntity[]
    ): Notification[] {
        return notificationEntities.map(NotificationParser.parseNotification);
    }
}
