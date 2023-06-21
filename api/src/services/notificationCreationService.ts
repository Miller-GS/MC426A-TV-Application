import { Repository } from "typeorm";
import { NotificationEntity, NotificationType } from "../entity/notification.entity";
import { NotificationParser } from "../models/notification";

export default abstract class NotificationCreationService {
    private notificationRepository: Repository<NotificationEntity>;

    public constructor(notificationRepository: Repository<NotificationEntity>) {
        this.notificationRepository = notificationRepository;
    }

    abstract getNotificationText() : string;
    abstract getNotificationType() : NotificationType;

    public async saveNotification(userId: number) {
        const text: string = this.getNotificationText();
        const type: NotificationType = this.getNotificationType();

        const notification = await this.notificationRepository.save({
            User: {
                Id: userId,
            },
            Text: text,
            Type: type,
        } as NotificationEntity);

        return NotificationParser.parseNotification(notification);
    } 
}

