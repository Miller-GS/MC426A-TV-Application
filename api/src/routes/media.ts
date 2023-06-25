import express from "express";
import { Repository } from "typeorm";

import { MediaController } from "../controllers/media";
import MediaService from "../services/mediaService";
import { MediaEntity } from "../entity/media.entity";
import appDataSource from "../config/ormconfig";

const mediaRouter = express.Router();
const mediaRepository = appDataSource.getRepository(MediaEntity);
const controller = new MediaController(new MediaService(mediaRepository));

mediaRouter.get(
    "/list",
    async (req, res) => await controller.listMedias(req, res)
);

mediaRouter.get(
    "/:id",
    async (req, res) => await controller.getMedia(req, res)
);

export default mediaRouter;
