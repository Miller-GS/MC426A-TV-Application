import axios, { AxiosError } from "axios";
import env from "../../environment";

import { TMDBMedia, TMDBMediaParser } from "../models/tmdbMedia";
import { HttpUtils } from "../utils/httpUtils";
import { ValidationUtils } from "../utils/validationUtils";
import { ListMediasParams } from "../models/listMediasParams";

export default class TMDBService {
    constructor() {}

    protected async get(path: String, params: Object) {
        params = HttpUtils.buildQuery({ ...params, api_key: env.TMDB_KEY });

        const url = env.TMDB_URL + path + "?" + params;

        const response = await axios.get(url);

        return response.data.results;
    }

    private async listMovies(params: ListMediasParams) {
        let data: Object[] = [];

        if (!ValidationUtils.isEmpty(params.name)) {
            data = await this.get("/search/movie", {
                query: params.name,
                year: params.year,
                page: params.page,
            });
        } else {
            data = await this.get("/discover/movie", {
                with_genres: params.genres,
                year: params.year,
                sort_by: "popularity.desc",
                page: params.page,
                "vote_average.gte": params.minVoteAverage,
                "vote_average.lte": params.maxVoteAverage,
                "vote_count.gte": params.minVoteCount,
                "vote_count.lte": params.maxVoteCount,
            });
        }

        const response: TMDBMedia[] = data.map(TMDBMediaParser.parseMovie);

        return response;
    }

    private async listTvShows(params: ListMediasParams) {
        let data: Object[] = [];

        if (!ValidationUtils.isEmpty(params.name)) {
            data = await this.get("/search/tv", {
                query: params.name,
                first_air_date_year: params.year,
                page: params.page,
            });
        } else {
            data = await this.get("/discover/tv", {
                with_genres: params.genres,
                first_air_date_year: params.year,
                sort_by: "popularity.desc",
                page: params.page,
                "vote_average.gte": params.minVoteAverage,
                "vote_average.lte": params.maxVoteAverage,
                "vote_count.gte": params.minVoteCount,
                "vote_count.lte": params.maxVoteCount,
            });
        }

        const response: TMDBMedia[] = data.map(TMDBMediaParser.parseTv);

        return response;
    }

    public async list(
        params: ListMediasParams,
        includeMovies: boolean,
        includeTvShows: boolean
    ) {
        let medias: TMDBMedia[] = [];

        if (includeTvShows) {
            medias = medias.concat(await this.listTvShows(params));
        }

        if (includeMovies) {
            medias = medias.concat(await this.listMovies(params));
        }

        return medias.sort((a, b) => b.popularity - a.popularity);
    }
}
