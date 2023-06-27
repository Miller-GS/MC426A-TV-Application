import express from "express";

import { MediaController } from "../controllers/media";
import TMDBRepository from "../repositories/tmdbRepository";
import MediaService from "../services/mediaService";
import { MediaEntity } from "../entity/media.entity";
import appDataSource from "../config/ormconfig";


const tmdbRepository = new TMDBRepository();
const mediaRepository = appDataSource.getRepository(MediaEntity);

const mediaRouter = express.Router();
const controller = new MediaController(new MediaService(mediaRepository, tmdbRepository));

mediaRouter.get(
    "/list",
    async (req, res) => await controller.listMedias(req, res)
);

mediaRouter.get(
    "/:id",
    async (req, res) => await controller.getMedia(req, res)
);

export default mediaRouter;
