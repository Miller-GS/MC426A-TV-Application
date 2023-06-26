import express from "express";
import { MediaController } from "../controllers/media";
import TMDBService from "../services/tmdbService";
import TMDBRepository from "../repositories/tmdbRepository";

const mediaRouter = express.Router();

const repository = new TMDBRepository();
const controller = new MediaController(new TMDBService(repository));

mediaRouter.get(
    "/list",
    async (req, res) => await controller.listMedias(req, res)
);

export default mediaRouter;
