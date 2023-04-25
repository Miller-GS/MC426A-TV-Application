import express, { Request, Response } from "express";
import UsersController from "../controllers/users";

export const usersRouter = express.Router();

const controller = new UsersController();

usersRouter.get("/login", controller.login);
