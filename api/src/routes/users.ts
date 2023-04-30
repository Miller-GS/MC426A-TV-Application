import express, { Request, Response } from "express";
import UsersController from "../controllers/users";

export const usersRouter = express.Router();

const controller = new UsersController();

usersRouter.post("/register", async (req,res) => await controller.register(req, res));
