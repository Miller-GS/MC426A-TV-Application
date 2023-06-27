import express from "express";
import { CommentController } from "../controllers/comment";
import { CommentEntity } from "../entity/comment.entity";
import { MediaEntity } from "../entity/media.entity";
import CommentService from "../services/commentService";
import appDataSource from "../config/ormconfig";
import auth from "../middleware/auth";
import { NotificationEntity } from "../entity/notification.entity";

const commentRouter = express.Router();

const commentRepository = appDataSource.getRepository(CommentEntity);
const mediaRepository = appDataSource.getRepository(MediaEntity);
const notificationRepository = appDataSource.getRepository(NotificationEntity);

const service = new CommentService(
    commentRepository,
    mediaRepository,
    notificationRepository
);
const controller = new CommentController(service);

commentRouter.get(
    "/list/media/:mediaId",
    async (req, res) => await controller.listComments(req, res)
);

commentRouter.post(
    "/",
    auth,
    async (req, res) => await controller.createComment(req, res)
);

commentRouter.patch(
    "/:commentId",
    auth,
    async (req, res) => await controller.updateComment(req, res)
);

commentRouter.delete(
    "/:commentId",
    auth,
    async (req, res) => await controller.deleteComment(req, res)
);

export default commentRouter;
