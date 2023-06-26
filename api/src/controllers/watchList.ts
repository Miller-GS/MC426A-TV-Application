import WatchListService from "../services/watchListService";
import { ValidationUtils } from "../utils/validationUtils";
import { Request, Response } from "express";
import { ErrorUtils } from "../utils/errorUtils";
import { WatchListPrivacyType } from "../entity/watchList.entity";
import { InvalidPrivacyTypeError } from "../errors/InvalidPrivacyType";

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
        }
        catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    private validatePrivacyType(privacyType: string) {
        if (!(<any>Object).values(WatchListPrivacyType).includes(privacyType))
            throw new InvalidPrivacyTypeError();
    }
}