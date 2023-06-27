import {
    FriendshipEntity,
    FriendshipStatus,
} from "../entity/friendship.entity";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";
import { FriendParser } from "../models/friend";
import { FriendshipAlreadyExistError } from "../errors/FriendshipAlreadyExistError";
import { FriendshipNotFoundError } from "../errors/FriendshipNotFoundError";
import { FriendRequestNotification } from "./friendRequestNotification";
import { NotificationEntity } from "../entity/notification.entity";

export default class FriendshipService {
    private friendshipRepository: Repository<FriendshipEntity>;
    private userRepository: Repository<UserEntity>;
    private notificationRepository: Repository<NotificationEntity>;

    public constructor(
        friendshipRepository: Repository<FriendshipEntity>,
        userRepository: Repository<UserEntity>,
        notificationRepository: Repository<NotificationEntity>
    ) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public async acceptFriendship({
        requestingUserId,
        acceptingUserId,
        accepted,
    }: {
        requestingUserId: number;
        acceptingUserId: number;
        accepted: boolean;
    }) {
        const friendship = await this.friendshipRepository.findOne({
            where: { UserId1: requestingUserId, UserId2: acceptingUserId },
        });

        if (!friendship) {
            throw new FriendshipNotFoundError();
        }

        friendship.Status = accepted
            ? FriendshipStatus.ACCEPTED
            : FriendshipStatus.DECLINED;
        this.friendshipRepository.save(friendship);

        return friendship;
    }

    public async createFriendship({
        userId1,
        userId2,
        status,
        actionUserId,
    }: {
        userId1: number;
        userId2: number;
        status: FriendshipStatus;
        actionUserId: number;
    }) {
        const friendshipAlreadyExist = await this.friendshipRepository.findOne({
            where: [
                { UserId1: userId1, UserId2: userId2 },
                { UserId1: userId2, UserId2: userId1 },
            ],
        });

        if (friendshipAlreadyExist) {
            throw new FriendshipAlreadyExistError();
        }

        const friendship = await this.friendshipRepository.save({
            UserId1: userId1,
            UserId2: userId2,
            Status: status,
            ActionUserId: actionUserId,
        } as FriendshipEntity);

        const notification = new FriendRequestNotification(
            this.notificationRepository,
            userId2,
            friendship
        );
        notification.saveNotification();

        return friendship;
    }

    public async listFriends(userId: number) {
        const friendships = await this.friendshipRepository.find({
            where: { UserId1: userId, Status: FriendshipStatus.ACCEPTED },
        });
        const friends = await this.userRepository.findByIds(
            friendships.map((f) => f.UserId2)
        );
        return friends.map((friend) => FriendParser.parseUserToFriend(friend));
    }
}
