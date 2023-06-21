import { Repository } from "typeorm";
import { NotificationEntity, NotificationType } from "../entity/notification.entity";
import { NotificationParser } from "../models/notification";
import { ValidationUtils } from "../utils/validationUtils";
import { UserIdError } from "../errors/UserIdError";
import { EmptyNotificationError } from "../errors/EmptyNotificationError";

export default abstract class NotificationCreationService {
    private notificationRepository: Repository<NotificationEntity>;

    public constructor(notificationRepository: Repository<NotificationEntity>) {
        this.notificationRepository = notificationRepository;
    }

    abstract getNotificationText() : string;
    abstract getNotificationType() : NotificationType;

    public async saveNotification(userId: number) {
        if (!ValidationUtils.isPositiveNumber(userId)) {
            throw new UserIdError();
        }

        const text: string = this.getNotificationText();
        const type: NotificationType = this.getNotificationType();

        if (ValidationUtils.isEmpty(text)) {
            throw new EmptyNotificationError();
        }

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

