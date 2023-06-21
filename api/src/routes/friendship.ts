import express from "express";
import { FriendshipController } from "../controllers/friendship";
import { FriendshipEntity } from "../entity/friendship.entity";
import { UserEntity } from "../entity/user.entity";
import FriendshipService from "../services/friendshipService";
import auth from "../middleware/auth";

import appDataSource from "../config/ormconfig";

const friendshipRouter = express.Router();

const friendshipRepository = appDataSource.getRepository(FriendshipEntity);
const userRepository = appDataSource.getRepository(UserEntity);
const service = new FriendshipService(friendshipRepository, userRepository);
const controller = new FriendshipController(service);

friendshipRouter.get(
    "/:userId",
    async (req, res) => await controller.listFriends(req, res)
);

friendshipRouter.post(
    "/add-friend/:userId",
    auth,
    async (req, res) => await controller.addFriend(req, res)
);

friendshipRouter.post(
    "/accept-friend/:userId",
    auth,
    async (req, res) => await controller.acceptFriend(req, res)
);

export default friendshipRouter;
