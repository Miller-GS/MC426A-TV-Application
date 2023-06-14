import { Response, Request } from "express";
import TMDBService from "../services/tmdbService";
import { ValidationUtils } from "../utils/validationUtils";
import { ListMediasParams } from "../models/listMediasParams";
import { ParseUtils } from "../utils/parseUtils";

export class MediaController {
    constructor(private readonly tmdbService: TMDBService) {}

    public async list_medias(req: Request, res: Response) {
        if (ValidationUtils.isEmpty(req.query)) {
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
            includeSeries,
            page,
        } = req.query;

        if (includeMovies !== "1" && includeSeries !== "1") {
            return res.status(400).json({
                message:
                    "You must provide least one of the following query parameters: includeMovies=1, includeSeries=1",
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
                includeMovies as String,
                includeSeries as String
            );

            return res.status(200).json(medias);
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    }
}
