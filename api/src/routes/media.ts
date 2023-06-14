import express from "express";
import { MediaController } from "../controllers/media";
import TMDBService from "../services/tmdbService";

const mediaRouter = express.Router();

const controller = new MediaController(new TMDBService());

mediaRouter.get(
    "/list",
    async (req, res) => await controller.list_medias(req, res)
);

export default mediaRouter;
