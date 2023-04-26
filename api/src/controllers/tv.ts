import { Response, Request } from "express";
import TMDBService from "../services/tmdbService";

export class TvController {
    constructor (private readonly tmdbService: TMDBService) {}

    public async list_shows(req: Request, res: Response) {
        const { name, genresString, year, isMovie, isSeries } = req.query;

        const genres = (genresString as String ?? '').split(",");

        const shows = await this.tmdbService.list(name as String, genres, year as String, isMovie as String, isSeries as String);

        return res.status(200).json(shows);
    }
}