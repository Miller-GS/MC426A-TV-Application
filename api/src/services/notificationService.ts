import { Repository } from "typeorm";
import { NotificationEntity } from "../entity/notification.entity";

export default class NotificationService {
    private notificationRepository: Repository<NotificationEntity>;

    public constructor(
        notificationRepository: Repository<NotificationEntity>
    ) {
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
}
