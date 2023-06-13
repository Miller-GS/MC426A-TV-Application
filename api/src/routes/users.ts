import express, { Request, Response } from "express";
import UsersController from "../controllers/users";
import appDataSource from "../config/ormconfig";

export const usersRouter = express.Router();

const controller = new UsersController(appDataSource);

usersRouter.post(
    "/register",
    async (req, res) => await controller.register(req, res)
);

usersRouter.post(
    "/login",
    async (req, res) => await controller.login(req, res)
);

usersRouter.post(
    "/:id/friends",
    async (req, res) => await controller.addFriend(req, res)
);

usersRouter.post(
    '/:id/friends/:friendId',
    async (req, res) => await controller.acceptFriend(req, res)
);

usersRouter.get(
    "/:id/friends",
    async (req, res) => await controller.getFriends(req, res)
)

usersRouter.get(
    "/refresh",
    async (req, res) => await controller.handleRefreshToken(req, res)
);

usersRouter.get(
    "/logout",
    async (req, res) => await controller.logout(req, res)
);
