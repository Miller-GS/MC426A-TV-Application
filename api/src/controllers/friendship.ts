import FriendshipService from "../services/friendshipService";
import { Response, Request } from "express";
import { ErrorUtils } from "../utils/errorUtils";
import { FriendshipStatus } from "../entity/friendship.entity";
import { ParseUtils } from "../utils/parseUtils";
import { ValidationUtils } from "../utils/validationUtils";
import { UserIdError } from "../errors/UserIdError";

export class FriendshipController {
    private friendshipService: FriendshipService;

    public constructor(friendshipService: FriendshipService) {
        this.friendshipService = friendshipService;
    }

    public async listFriends(req: Request, res: Response) {
        if (
            ValidationUtils.isEmpty(req.params["userId"]) ||
            !ValidationUtils.isPositiveNumber(req.params["userId"])
        )
            throw new UserIdError();

        const userId = parseInt(req.params["userId"]);

        try {
            const friends = await this.friendshipService.listFriends(userId);
            return res.status(200).json(friends);
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    public async addFriend(req: Request, res: Response) {
        const askerUserId = parseInt(req["user"].id);
        const askedUserId = parseInt(req.params["userId"]);
        try {
            const friendship = await this.friendshipService.createFriendship(
                askerUserId,
                askedUserId,
                FriendshipStatus.PENDING,
                askedUserId
            );

            return res.status(201).json(friendship);
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    public async replyFriendshipRequest(req: Request, res: Response) {
        const requestingUserId = req["user"].id;
        const acceptingUserId = parseInt(req.params["userId"]);
        const accepted = ParseUtils.parseBoolean(req.query.accepted as string);

        try {
            const friendship =
                await this.friendshipService.replyFriendshipRequest(
                    requestingUserId,
                    acceptingUserId,
                    accepted
                );

            return res.status(201).json(friendship);
        } catch (err: any) {
            return ErrorUtils.handleError(err, res);
        }
    }
}
