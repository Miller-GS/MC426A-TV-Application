import {
    NotificationEntity,
    NotificationType,
} from "../entity/notification.entity";
import NotificationCreationService from "./notificationCreationService";
import { Repository } from "typeorm";
import { FriendshipEntity } from "../entity/friendship.entity";

export class FriendAcceptNotification extends NotificationCreationService {
    private friendship: FriendshipEntity;

    public constructor(
        notificationRepository: Repository<NotificationEntity>,
        userId: number,
        friendship: FriendshipEntity
    ) {
        super(notificationRepository, userId);

        this.friendship = friendship;
    }

    getNotificationText(): string {
        return `User ${this.friendship.UserId2} accepted your friendship request.`;
    }

    getNotificationType(): NotificationType {
        return NotificationType.FRIEND_REQUEST;
    }
}
