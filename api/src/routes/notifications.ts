import express from "express";
import appDataSource from "../config/ormconfig";
import NotificationsController from "../controllers/notifications";
import auth from "../middleware/auth";

export const notificationsRouter = express.Router();

const controller = new NotificationsController(appDataSource);

notificationsRouter.get(
    "/list",
    [auth],
    async (req, res) => await controller.list(req, res)
);
