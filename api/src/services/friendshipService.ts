import {
    FriendshipEntity,
    FriendshipStatus,
} from "../entity/friendship.entity";
import { Repository } from "typeorm";
import { FriendshipAlreadyExistError } from "../errors/FriendshipAlreadyExistError";
import { FriendshipNotFoundError } from "../errors/FriendshipNotFoundError";
import { FriendRequestNotification } from "./friendRequestNotification";
import { NotificationEntity } from "../entity/notification.entity";
import { ValidationUtils } from "../utils/validationUtils";
import { FriendAcceptNotification } from "./friendAcceptNotification";
import { SelfFriendshipError } from "../errors/SelfFriendshipError";

export default class FriendshipService {
    private friendshipRepository: Repository<FriendshipEntity>;
    private notificationRepository: Repository<NotificationEntity>;

    public constructor(
        friendshipRepository: Repository<FriendshipEntity>,
        notificationRepository: Repository<NotificationEntity>
    ) {
        this.friendshipRepository = friendshipRepository;
        this.notificationRepository = notificationRepository;
    }

    public async replyFriendshipRequest(
        requestingUserId: number,
        acceptingUserId: number,
        accepted: boolean
    ) {
        const friendship = await this.friendshipRepository.findOne({
            where: { UserId1: requestingUserId, UserId2: acceptingUserId },
        });

        if (!friendship) throw new FriendshipNotFoundError();

        friendship.Status = accepted
            ? FriendshipStatus.ACCEPTED
            : FriendshipStatus.DECLINED;
        this.friendshipRepository.save(friendship);

        if (accepted) {
            const notification = new FriendAcceptNotification(
                this.notificationRepository,
                requestingUserId,
                friendship
            );
            notification.saveNotification();
        }

        return friendship;
    }

    public async createFriendship(
        senderId: number,
        receiverId: number,
        status: FriendshipStatus,
        actionUserId: number
    ) {
        if (senderId == receiverId) throw new SelfFriendshipError();

        const areFriends = await ValidationUtils.areFriends(
            this.friendshipRepository,
            senderId,
            receiverId
        );

        if (areFriends) throw new FriendshipAlreadyExistError();

        const friendship = await this.friendshipRepository.save({
            UserId1: senderId,
            UserId2: receiverId,
            Status: status,
            ActionUserId: actionUserId,
        } as FriendshipEntity);

        const notification = new FriendRequestNotification(
            this.notificationRepository,
            receiverId,
            friendship
        );
        notification.saveNotification();

        return friendship;
    }

    public async listFriends(userId: number) {
        const friendships_user1 = await this.friendshipRepository.find({
            where: { UserId1: userId, Status: FriendshipStatus.ACCEPTED },
        });
        const friendships_user2 = await this.friendshipRepository.find({
            where: { UserId2: userId, Status: FriendshipStatus.ACCEPTED },
        });

        let friendships = [];

        friendships = friendships.concat(
            friendships_user1.map((f) => f.UserId2)
        );
        friendships = friendships.concat(
            friendships_user2.map((f) => f.UserId1)
        );

        return friendships;
    }
}
