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
