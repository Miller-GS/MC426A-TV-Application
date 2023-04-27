import express from "express";
import { TvController } from "../controllers/tv";
import TMDBService from "../services/tmdbService";

const tvRouter = express.Router();

const controller = new TvController(new TMDBService());

tvRouter.get(
    "/list",
    async (req, res) => await controller.list_shows(req, res)
);

export default tvRouter;
