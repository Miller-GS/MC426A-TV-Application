import { Response, Request } from "express";

import { ValidationUtils } from "../utils/validationUtils";
import { ErrorUtils } from "../utils/errorUtils";
import { ParseUtils } from "../utils/parseUtils";
import RatingService from "../services/ratingService";

export class RatingController {
    private ratingService: RatingService;

    public constructor(ratingService: RatingService) {
        this.ratingService = ratingService;
    }

    public async createRating(req: Request, res: Response) {
        const { rating, review, mediaId } = req.body;
        if (!this.validateMediaId(mediaId, res)) return res;
        if (!this.validateRating(rating, res)) return res;
        if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;

        const userId = req["user"].id;
        try {
            await this.ratingService.createRating(userId, mediaId, rating, review);
            return res.status(201);
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    public async updateRating(req: Request, res: Response) {
        const { rating, review, ratingId } = req.body;
        if (!this.validateRatingId(ratingId, res)) return res;
        if (!this.validateRating(rating, res)) return res;
        if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;

        const userId = req["user"].id;

        try {
            await this.ratingService.updateRating(userId, ratingId, rating, review);
            return res.status(204);
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    public async deleteRating(req: Request, res: Response) {
        const { ratingId } = req.body;
        if (!this.validateRatingId(ratingId, res)) return res;
        if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;

        const userId = req["user"].id;

        try {
            await this.ratingService.deleteRating(userId, ratingId);
            return res.status(204);
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    public async getUserRating(req: Request, res: Response) {
        const mediaId = req.params["mediaId"];
        if (!this.validateMediaId(mediaId, res)) return res;
        if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;

        const userId = req["user"].id;
        try {
            const ratingResponse = await this.ratingService.getUserRating(
                userId,
                ParseUtils.parseIntOrUndefined(mediaId) as number
            );
            return res.status(200).json(ratingResponse)
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    public async listRatings(req: Request, res: Response) {
        const mediaId = req.params["mediaId"];
        if (!this.validateMediaId(mediaId, res)) return res;

        try {
            const ratings = await this.ratingService.listRatings(
                ParseUtils.parseIntOrUndefined(mediaId) as number
            );
            return res.status(200).json(ratings)
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    private validateMediaId(mediaId: any, res: Response) {
        if (ValidationUtils.isEmpty(mediaId) || isNaN(mediaId)) {
            res.status(400).json({
                message: "Bad request: Media ID necessary",
            });
            return false;
        }
        return true;
    }

    private validateRatingId(ratingId: any, res: Response) {
        if (ValidationUtils.isEmpty(ratingId) || isNaN(ratingId)) {
            res.status(400).json({
                message: "Bad request: Rating ID necessary",
            });
            return false;
        }
        return true;
    }

    private validateRating(rating: any, res: Response) {
        const rateValue = ParseUtils.parseFloatOrUndefined(rating);
        if (rateValue === undefined || rateValue > 10 || rateValue < 0) {
            res.status(400).json({
                message:
                    "Bad request: Rating value between 0 and 10 is necessary",
            });
            return false;
        }
        return true;
    }
}
