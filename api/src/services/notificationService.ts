import { Repository } from "typeorm";
import { NotificationEntity } from "../entity/notification.entity";
import { NotificationNotFoundError } from "../errors/NotificationNotFoundError";
import { ValidationUtils } from "../utils/validationUtils";
import { NotificationAlreadyReadError } from "../errors/NotificationAlreadyReadError";

export default class NotificationService {
    private notificationRepository: Repository<NotificationEntity>;

    public constructor(notificationRepository: Repository<NotificationEntity>) {
        this.notificationRepository = notificationRepository;
    }

    public async listNotifications(userId: number, withDeleted: boolean) {
        const notifications = await this.notificationRepository.find({
            where: {
                User: {
                    Id: userId,
                },
            },
            withDeleted: withDeleted,
        });

        return notifications;
    }

    public async readNotification(notificationId: number) {
        const notification = await this.notificationRepository.findOne({
            where: {
                Id: notificationId,
            },
            withDeleted: true,
        });

        if (!notification) {
            throw new NotificationNotFoundError();
        }

        if (!ValidationUtils.isNull(notification.ReadAt)) {
            throw new NotificationAlreadyReadError();
        }

        await this.notificationRepository.update(notificationId, {
            ReadAt: new Date(),
        });
    }
}
