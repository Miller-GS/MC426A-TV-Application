import { WatchListController } from "../controllers/watchList";
import appDataSource from "../config/ormconfig";
import WatchListService from "../services/watchListService";
import { UserEntity } from "../entity/user.entity";
import { WatchListEntity } from "../entity/watchList.entity";
import { WatchListItemEntity } from "../entity/watchListItem.entity";
import { MediaEntity } from "../entity/media.entity";
import express from "express";
import auth from "../middleware/auth";

export const watchListRouter = express.Router();

const userRepository = appDataSource.getRepository(UserEntity);
const watchListRepository = appDataSource.getRepository(WatchListEntity);
const watchListItemRepository = appDataSource.getRepository(WatchListItemEntity);
const mediaRepository = appDataSource.getRepository(MediaEntity);

const service = new WatchListService(
    watchListRepository,
    watchListItemRepository,
    userRepository,
    mediaRepository,
);

const controller = new WatchListController(service);

watchListRouter.post(
    "/create/",
    auth,
    async (req, res) => await controller.createWatchList(req, res)
);