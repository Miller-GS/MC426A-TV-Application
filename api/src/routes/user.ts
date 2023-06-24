import express, { Request, Response } from "express";
import UserController from "../controllers/user";
import appDataSource from "../config/ormconfig";
import UserService from "../services/userService";
import { UserEntity } from "../entity/user.entity";

export const userRouter = express.Router();

const userRepository = appDataSource.getRepository(UserEntity);

const service = new UserService(userRepository);
const controller = new UserController(service);

userRouter.post(
    "/register",
    async (req, res) => await controller.register(req, res)
);

userRouter.post("/login", async (req, res) => await controller.login(req, res));

userRouter.get(
    "/refresh",
    async (req, res) => await controller.handleRefreshToken(req, res)
);

userRouter.get(
    "/logout",
    async (req, res) => await controller.logout(req, res)
);
