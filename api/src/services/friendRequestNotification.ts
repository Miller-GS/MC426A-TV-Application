import {
    NotificationEntity,
    NotificationType,
} from "../entity/notification.entity";
import NotificationCreationService from "./notificationCreationService";
import { Repository } from "typeorm";
import { FriendshipEntity } from "../entity/friendship.entity";

export class FriendRequestNotification extends NotificationCreationService {
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
        return `User ${this.friendship.UserId1} wants to add you as a friend.`;
    }

    getNotificationType(): NotificationType {
        return NotificationType.FRIEND_REQUEST;
    }
}
