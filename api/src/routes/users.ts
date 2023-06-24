import express, { Request, Response } from "express";
import UsersController from "../controllers/users";
import appDataSource from "../config/ormconfig";
import UserService from "../services/userService";
import { UserEntity } from "../entity/user.entity";

export const usersRouter = express.Router();

const userRepository = appDataSource.getRepository(UserEntity);

const service = new UserService(userRepository);
const controller = new UsersController(service);

usersRouter.post(
    "/register",
    async (req, res) => await controller.register(req, res)
);

usersRouter.post(
    "/login",
    async (req, res) => await controller.login(req, res)
);

usersRouter.get(
    "/refresh",
    async (req, res) => await controller.handleRefreshToken(req, res)
);

usersRouter.get(
    "/logout",
    async (req, res) => await controller.logout(req, res)
);
