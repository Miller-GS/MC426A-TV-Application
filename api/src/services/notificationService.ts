import { Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { NotificationEntity } from "../entity/notification.entity";

export default class NotificationService {
    private notificationRepository: Repository<NotificationEntity>;

    public constructor(
        notificationRepository: Repository<NotificationEntity>
    ) {
        this.notificationRepository = notificationRepository;
    }

    public async listNotifications(userId: number) {
        const notifications = await this.notificationRepository.find({
            where: {
                User: {
                    Id: userId,
                },
            },
            withDeleted: true,
        });

        return notifications;
    }
}
