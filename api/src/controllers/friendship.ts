import FriendshipService from "../services/friendshipService";
import { Response, Request } from "express";
import { ErrorUtils } from "../utils/errorUtils";
import { InvalidUserParamsError } from "../errors/InvalidUserParamsError";
import { ConvertionUtils } from "../utils/convertionUtils";
import {
    FriendshipEntity,
    FriendshipStatus,
} from "../entity/friendship.entity";

export class FriendshipController {
    private friendshipService: FriendshipService;

    public constructor(friendshipService: FriendshipService) {
        this.friendshipService = friendshipService;
    }

    public async listFriends(req: Request, res: Response) {
        const userId = parseInt(req.params["userId"]);

        if (isNaN(userId) || userId < 0) {
            throw new InvalidUserParamsError()
        }

        try {
            const friends = await this.friendshipService.listFriends(
                userId
            );
            return res.status(200).json(friends);
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    public async addFriend(req: Request, res: Response) {
        const askerUserId = parseInt(req["user"].id);
        const askedUserId = parseInt(req.params["userId"]);

        const friendship = await this.friendshipService.createFriendship({
            userId1: askerUserId,
            userId2: askedUserId,
            status: FriendshipStatus.PENDING,
            actionUserId: askedUserId,
        });

        return res.status(201).json(friendship);
    }

    public async acceptFriend(req: Request, res: Response) {
        const requestingUserId = req["user"].id;
        const acceptingUserId = parseInt(req.params["userId"]);
        const accepted = ConvertionUtils.stringToBoolean(req.body["accepted"]);

        const friendship = await this.friendshipService.acceptFriendship({
            requestingUserId,
            acceptingUserId,
            accepted,
        });

        return res.status(201).json(friendship);
    }
}
