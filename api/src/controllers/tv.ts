import { Response, Request } from "express";
import TMDBService from "../services/tmdbService";

export class TvController {
    constructor(private readonly tmdbService: TMDBService) {}

    public async list_shows(req: Request, res: Response) {
        const { name, genres, year, isMovie, isSeries, page } = req.query;

        const shows = await this.tmdbService.list(
            name as String,
            genres as String,
            year as String,
            isMovie as String,
            isSeries as String,
            page as unknown as number
        );

        return res.status(200).json(shows);
    }
}
