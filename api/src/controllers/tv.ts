import { Response, Request } from "express";
import TMDBService from "../services/tmdbService";

export class TvController {
    constructor(private readonly tmdbService: TMDBService) {}

    public async list_shows(req: Request, res: Response) {
        const { name, genres, year, isMovie, isSeries, page } = req.query;

        if (isMovie !== "1" && isSeries !== "1") {
            return res
                .status(400)
                .json({
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
