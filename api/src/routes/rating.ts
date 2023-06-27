import express from "express";
import { RatingController } from "../controllers/rating";
import { RatingEntity } from "../entity/rating.entity";
import { MediaEntity } from "../entity/media.entity";
import ratingService from "../services/ratingService";
import appDataSource from "../config/ormconfig";
import auth from "../middleware/auth";

const ratingRouter = express.Router();

const ratingRepository = appDataSource.getRepository(RatingEntity);
const mediaRepository = appDataSource.getRepository(MediaEntity);

const service = new ratingService(ratingRepository, mediaRepository);
const controller = new RatingController(service);

ratingRouter.get(
    "/list/media/:mediaId",
    async (req, res) => await controller.listRatings(req, res)
);

ratingRouter.get(
    "/average/media/:mediaId",
    async (req, res) => await controller.getMediaAvgRating(req, res)
);

ratingRouter.get(
    "/media/:mediaId",
    auth,
    async (req, res) => await controller.getUserRating(req, res)
);

ratingRouter.post(
    "/",
    auth,
    async (req, res) => await controller.createRating(req, res)
);

ratingRouter.patch(
    "/:ratingId",
    auth,
    async (req, res) => await controller.updateRating(req, res)
);

ratingRouter.delete(
    "/:ratingId",
    auth,
    async (req, res) => await controller.deleteRating(req, res)
);

export default ratingRouter;
