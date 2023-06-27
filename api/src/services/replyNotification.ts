import {
    NotificationEntity,
    NotificationType,
} from "../entity/notification.entity";
import NotificationCreationService from "./notificationCreationService";
import { Comment } from "../models/comment";
import { Repository } from "typeorm";

export class ReplyNotification extends NotificationCreationService {
    private comment: Comment;

    public constructor(
        notificationRepository: Repository<NotificationEntity>,
        userId: number,
        comment: Comment
    ) {
        super(notificationRepository, userId);

        this.comment = comment;
    }

    getNotificationText(): string {
        return `User ${this.userId} replied to your comment made at ${this.comment.mediaId}.`;
    }

    getNotificationType(): NotificationType {
        return NotificationType.COMMENT_REPLY;
    }
}
