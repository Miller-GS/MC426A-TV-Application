import { Response, Request } from "express";
import TMDBService from "../services/tmdbService";
import { ValidationUtils } from "../utils/validationUtils";
import { ListMediasParams } from "../models/listMediasParams";
import { ParseUtils } from "../utils/parseUtils";
import { ConvertionUtils } from "../utils/convertionUtils";

export class MediaController {
    constructor(private readonly tmdbService: TMDBService) {}

    public async listMedias(req: Request, res: Response) {
        if (ValidationUtils.isNull(req.query)) {
            return res.status(400).json({
                message: "Bad request: Query was undefined",
            });
        }

        const {
            name,
            genres,
            year,
            minVoteAverage,
            maxVoteAverage,
            minVoteCount,
            maxVoteCount,
            includeMovies,
            includeTvShows,
            page,
        } = req.query;

        const includeMoviesBool = ConvertionUtils.stringToBoolean(includeMovies as string)
        const includeTvShowsBool = ConvertionUtils.stringToBoolean(includeTvShows as string)

        if (!includeMoviesBool && !includeTvShowsBool) {
            return res.status(400).json({
                message:
                    "You must provide least one of the following query parameters: includeMovies=1, includeTvShows=1",
            });
        }

        try {
            const params = {
                name: name as String,
                genres: genres as String,
                year: ParseUtils.parseIntOrUndefined(year as string),
                minVoteAverage: ParseUtils.parseFloatOrUndefined(
                    minVoteAverage as string
                ),
                maxVoteAverage: ParseUtils.parseFloatOrUndefined(
                    maxVoteAverage as string
                ),
                minVoteCount: ParseUtils.parseIntOrUndefined(
                    minVoteCount as string
                ),
                maxVoteCount: ParseUtils.parseIntOrUndefined(
                    maxVoteCount as string
                ),
                page: ParseUtils.parseIntOrUndefined(page as string) ?? 1,
            } as ListMediasParams;

            const medias = await this.tmdbService.list(
                params,
                includeMoviesBool,
                includeTvShowsBool
            );

            return res.status(200).json(medias);
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    }
}
