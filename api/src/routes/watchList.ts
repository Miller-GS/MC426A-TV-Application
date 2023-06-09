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
import { FriendshipEntity } from "../entity/friendship.entity";

export const watchListRouter = express.Router();

const userRepository = appDataSource.getRepository(UserEntity);
const watchListRepository = appDataSource.getRepository(WatchListEntity);
const watchListItemRepository =
    appDataSource.getRepository(WatchListItemEntity);
const mediaRepository = appDataSource.getRepository(MediaEntity);
const tmdbRepository = new TMDBRepository();
const friendshipRepository = appDataSource.getRepository(FriendshipEntity);

const service = new WatchListService(
    watchListRepository,
    watchListItemRepository,
    userRepository,
    mediaRepository,
    tmdbRepository,
    friendshipRepository
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

watchListRouter.patch(
    "/:id/",
    auth,
    async (req, res) => await controller.updateWatchList(req, res)
);

watchListRouter.delete(
    "/delete/:id/",
    auth,
    async (req, res) => await controller.deleteWatchList(req, res)
);

watchListRouter.delete(
    "/removeItems/",
    auth,
    async (req, res) => await controller.removeWatchListItems(req, res)
);
