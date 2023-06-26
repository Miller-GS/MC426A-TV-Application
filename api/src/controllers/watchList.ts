import WatchListService from "../services/watchListService";
import { ValidationUtils } from "../utils/validationUtils";
import { Request, Response } from "express";
import { ErrorUtils } from "../utils/errorUtils";
import { WatchListPrivacyType } from "../entity/watchList.entity";
import { InvalidPrivacyTypeError } from "../errors/InvalidPrivacyTypeError";
import { WatchListIdNotProvidedError } from "../errors/WatchListIdNotProvidedError";
import { MediaIdsNotProvidedError } from "../errors/MediaIdsNotProvidedError";

export class WatchListController {
    private watchListService: WatchListService;

    public constructor(watchListService: WatchListService) {
        this.watchListService = watchListService;
    }

    public async createWatchList(req: Request, res: Response) {
        const { title, description, privacyType } = req.body;

        try {
            this.validatePrivacyType(privacyType);
            if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;

            const userId = req["user"].id;
            const watchList = await this.watchListService.createWatchList(
                userId,
                title,
                description,
                privacyType
            );
            return res.status(201).json(watchList);
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    private validatePrivacyType(privacyType: string) {
        if (!(<any>Object).values(WatchListPrivacyType).includes(privacyType))
            throw new InvalidPrivacyTypeError();
    }

    public async addWatchListItems(req: Request, res: Response) {
        const { watchListId, mediaIds } = req.body;

        try {
            if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;
            if (ValidationUtils.isEmpty(watchListId))
                throw new WatchListIdNotProvidedError();
            if (ValidationUtils.isEmpty(mediaIds) || !Array.isArray(mediaIds))
                throw new MediaIdsNotProvidedError();

            const userId = req["user"].id;
            const items = await this.watchListService.addWatchListItems(
                userId,
                watchListId,
                mediaIds
            );
            return res.status(201).json(items);
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    public async getWatchList(req: Request, res: Response) {
        const { id } = req.params;

        try {
            if (!ValidationUtils.isPositiveNumber(id))
                throw new WatchListIdNotProvidedError();

            const userId = req["user"]?.id;
            const watchList = await this.watchListService.getWatchListItems(
                userId,
                parseInt(id)
            );
            return res.status(200).json(watchList);
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }
}
