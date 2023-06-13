import express from "express";
import appDataSource from "../config/ormconfig";
import NotificationController from "../controllers/notification";
import auth from "../middleware/auth";
import { NotificationEntity } from "../entity/notification.entity";
import NotificationService from "../services/notificationService";

export const notificationRouter = express.Router();

const notificationRepository = appDataSource.getRepository(NotificationEntity);
const service = new NotificationService(notificationRepository);
const controller = new NotificationController(service);

notificationRouter.get(
    "/",
    auth,
    async (req, res) => await controller.listNotifications(req, res)
);

notificationRouter.get(
    "/new",
    auth,
    async (req, res) => await controller.listNewNotifications(req, res)
);
