import axios, { AxiosError } from "axios";
import env from "../../environment";

import { Show, ShowParser } from "../model/show";

export default class TMDBService {
    constructor() {}

    private buildQuery(obj) {
        return Object.keys(obj)
            .map((key) => {
                return `${key}=${encodeURIComponent(obj[key])}`;
            })
            .join("&");
    }

    private isEmpty(str) {
        return str == "" || str == undefined;
    }

    private async getGenresIDs(genres: String[]) {
        return [];
    }

    private async get(path: String, params: Object) {
        params = this.buildQuery({ ...params, api_key: env.TMDB_KEY });

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
        page: number
    ) {
        let data: Object[] = [];

        try {
            if (!this.isEmpty(name)) {
                data = await this.get("/search/movie", { query: name, year });
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
        page: number
    ) {
        let data: Object[] = [];

        try {
            if (!this.isEmpty(name)) {
                data = await this.get("/search/tv", { query: name, year });
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
        page: number
    ) {
        let shows: Show[] = [];

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
