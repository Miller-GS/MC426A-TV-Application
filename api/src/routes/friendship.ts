import express from "express";
import { FriendshipController } from "../controllers/friendship";
import { FriendshipEntity } from "../entity/friendship.entity";
import FriendshipService from "../services/friendshipService";
import auth from "../middleware/auth";

import appDataSource from "../config/ormconfig";
import { NotificationEntity } from "../entity/notification.entity";

const friendshipRouter = express.Router();

const friendshipRepository = appDataSource.getRepository(FriendshipEntity);
const notificationRepository = appDataSource.getRepository(NotificationEntity);

const service = new FriendshipService(
    friendshipRepository,
    notificationRepository
);
const controller = new FriendshipController(service);

friendshipRouter.get(
    "/:userId",
    async (req, res) => await controller.listFriends(req, res)
);

friendshipRouter.post(
    "/add/:userId",
    auth,
    async (req, res) => await controller.addFriend(req, res)
);

friendshipRouter.post(
    "/reply/:userId",
    auth,
    async (req, res) => await controller.replyFriendshipRequest(req, res)
);

export default friendshipRouter;
