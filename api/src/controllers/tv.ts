import { Response, Request } from "express";
import TMDBService from "../services/tmdbService";
import { ValidationUtils } from "../utils/validationUtils";

export class TvController {
    constructor(private readonly tmdbService: TMDBService) {}

    public async list_shows(req: Request, res: Response) {
        if (ValidationUtils.isEmpty(req.query)) {
            return res.status(400).json({
                message: "Bad request: Query was undefined",
            });
        }

        const { name, genres, year, isMovie, isSeries, page } = req.query;

        if (isMovie !== "1" && isSeries !== "1") {
            return res.status(400).json({
                message:
                    "You must provide least one of the following query parameters: isMovie=1, isSeries=1",
            });
        }

        const shows = await this.tmdbService.list(
            name as String,
            genres as String,
            year as String,
            isMovie as String,
            isSeries as String,
            page as String
        );

        return res.status(200).json(shows);
    }
}
