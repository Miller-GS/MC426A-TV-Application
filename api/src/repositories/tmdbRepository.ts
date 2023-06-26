import { ListMediasParams } from "../models/listMediasParams";
import { HttpUtils } from "../utils/httpUtils";
import env from "../../environment";
import axios from "axios";
import { ValidationUtils } from "../utils/validationUtils";
import { TMDBMedia, TMDBMediaParser, MediaTypeEnum } from "../models/tmdbMedia";
import { InvalidMediaTypeError } from "../errors/InvalidMediaType";

export default class TMDBRepository {
    protected async get(path: String, params: Object) {
        params = HttpUtils.buildQuery({ ...params, api_key: env.TMDB_KEY });

        const url = env.TMDB_URL + path + "?" + params;

        const response = await axios.get(url);

        return response.data.results;
    }

    public async listMovies(params: ListMediasParams) {
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

    public async listTvShows(params: ListMediasParams) {
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

    public async getMovie(id: number) {
        const tmdbMedia = await this.get(
            "/movie/" + id,
            {}
        );
        return TMDBMediaParser.parseMovie(tmdbMedia);
    }

    public async getTVShow(id: number) {
        const tmdbMedia = await this.get(
            "/tv/" + id,
            {}
        );
        return TMDBMediaParser.parseTv(tmdbMedia);
    }

    public async getMedia(id: number, mediaType: MediaTypeEnum) {
        if (mediaType == MediaTypeEnum.MOVIE) 
            return this.getMovie(id);
        if (mediaType == MediaTypeEnum.TV)
            return this.getTVShow(id);
        throw new InvalidMediaTypeError();
    }
}