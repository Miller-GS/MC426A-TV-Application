import axios, { AxiosError } from "axios";
import env from "../../environment";

import { Show, ShowParser } from "../models/show";
import { HttpUtils } from "../utils/httpUtils";
import { ValidationUtils } from "../utils/validationUtils";

export default class TMDBService {
    constructor() {}

    protected async get(path: String, params: Object) {
        params = HttpUtils.buildQuery({ ...params, api_key: env.TMDB_KEY });

        try {
            let uri = env.TMDB_URL + path + "?" + params;
            const response = await axios.get(uri);
            return response.data.results;
        } catch (e) {
            const err = e as AxiosError;
            console.log("Something went wrong.");
            console.log(err.message);

            return [];
        }
    }

    private async listMovies(
        name: String,
        genres: String,
        year: String,
        page: String
    ) {
        let data: Object[] = [];

        try {
            if (!ValidationUtils.isEmpty(name)) {
                data = await this.get("/search/movie", {
                    query: name,
                    year,
                    page,
                });
            } else {
                data = await this.get("/discover/movie", {
                    with_genres: genres,
                    year: year,
                    sort_by: "popularity.desc",
                    page: page,
                });
            }
        } catch {}

        const response: Show[] = data.map(ShowParser.parseMovie);

        return response;
    }

    private async listTvShows(
        name: String,
        genres: String,
        year: String,
        page: String
    ) {
        let data: Object[] = [];

        try {
            if (!ValidationUtils.isEmpty(name)) {
                data = await this.get("/search/tv", {
                    query: name,
                    first_air_date_year: year,
                    page,
                });
            } else {
                data = await this.get("/discover/tv", {
                    with_genres: genres,
                    first_air_date_year: year,
                    sort_by: "popularity.desc",
                    page: page,
                });
            }
        } catch {}

        const response: Show[] = data.map(ShowParser.parseTv);

        return response;
    }

    public async list(
        name: String,
        genres: String,
        year: String,
        isMovie: String,
        isSeries: String,
        page: String
    ) {
        let shows: Show[] = [];

        if (!ValidationUtils.isPositiveNumber(page)) {
            page = "1";
        }

        if (isSeries === "1") {
            shows = shows.concat(
                await this.listTvShows(name, genres, year, page)
            );
        }

        if (isMovie === "1") {
            shows = shows.concat(
                await this.listMovies(name, genres, year, page)
            );
        }

        return shows.sort((a, b) => b.popularity - a.popularity);
    }
}
