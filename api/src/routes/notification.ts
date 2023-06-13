import express from "express";
import appDataSource from "../config/ormconfig";
import NotificationsController from "../controllers/notifications";
import auth from "../middleware/auth";

export const notificationRouter = express.Router();

const controller = new NotificationsController(appDataSource);

notificationRouter.get(
    "/list",
    [auth],
    async (req, res) => await controller.list(req, res)
);
