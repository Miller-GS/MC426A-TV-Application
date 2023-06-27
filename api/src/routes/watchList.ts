import { WatchListController } from "../controllers/watchList";
import appDataSource from "../config/ormconfig";
import WatchListService from "../services/watchListService";
import { UserEntity } from "../entity/user.entity";
import { WatchListEntity } from "../entity/watchList.entity";
import { WatchListItemEntity } from "../entity/watchListItem.entity";
import { MediaEntity } from "../entity/media.entity";
import express from "express";
import auth, { optionalAuth } from "../middleware/auth";
import TMDBRepository from "../repositories/tmdbRepository";

export const watchListRouter = express.Router();

const userRepository = appDataSource.getRepository(UserEntity);
const watchListRepository = appDataSource.getRepository(WatchListEntity);
const watchListItemRepository =
    appDataSource.getRepository(WatchListItemEntity);
const mediaRepository = appDataSource.getRepository(MediaEntity);
const tmdbRepository = new TMDBRepository();

const service = new WatchListService(
    watchListRepository,
    watchListItemRepository,
    userRepository,
    mediaRepository,
    tmdbRepository
);

const controller = new WatchListController(service);

watchListRouter.get(
    "/:id/",
    optionalAuth,
    async (req, res) => await controller.getWatchList(req, res)
);

watchListRouter.post(
    "/create/",
    auth,
    async (req, res) => await controller.createWatchList(req, res)
);

watchListRouter.post(
    "/add/",
    auth,
    async (req, res) => await controller.addWatchListItems(req, res)
);
