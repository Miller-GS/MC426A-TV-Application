import { FriendshipEntity, FriendshipStatus } from "../entity/friendship.entity";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";
import { FriendParser } from "../models/friend";
import { FriendshipAlreadyExistError } from "../errors/FriendshipAlreadyExistError";
import { FriendshipNotFoundError } from "../errors/FriendshipNotFoundError";

export default class CommentService {
    private friendshipRepository: Repository<FriendshipEntity>;
    private userRepository: Repository<UserEntity>;

    public constructor(
        friendshipRepository: Repository<FriendshipEntity>,
        userRepository: Repository<UserEntity>
    ) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    public async acceptFriendship({
        accepterUserId,
        acceptedUserId,
        accepted
    }: {
        accepterUserId: number,
        acceptedUserId: number,
        accepted: boolean
    }) {
        const friendship = await this.friendshipRepository.findOne({
            where: { UserId1: accepterUserId, UserId2: acceptedUserId }
        });


        if (!friendship) {
            throw new FriendshipNotFoundError();
        }

        friendship.Status = accepted ? FriendshipStatus.ACCEPTED : FriendshipStatus.DECLINED;
        this.friendshipRepository.save(friendship);

        return friendship;
    }

    public async createFriendship({
        userId1,
        userId2,
        status,
        actionUserId
    }: {
        userId1: number,
        userId2: number,
        status: FriendshipStatus,
        actionUserId: number
    }) {

        const friendshipAlreadyExist = await this.friendshipRepository.findOne({
            where: [{ UserId1: userId1, UserId2: userId2 }, { UserId1: userId2, UserId2: userId1 }]
        });

        if (friendshipAlreadyExist) {
            throw new FriendshipAlreadyExistError();
        }

        const friendship = await this.friendshipRepository.save({
            UserId1: userId1,
            UserId2: userId2,
            Status: status,
            ActionUserId: actionUserId
        } as FriendshipEntity);

        return friendship;
    }

    public async listFriends(userId: number) {
        const friendships = await this.friendshipRepository.find({
            where: { UserId1: userId, Status: FriendshipStatus.ACCEPTED }
        });
        const friends = await this.userRepository.findByIds(friendships.map(f => f.UserId2));
        return friends.map(friend => FriendParser.parseUserToFriend(friend));;
    }
}
