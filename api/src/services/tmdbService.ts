import axios, {AxiosError} from "axios"
import env from "../../environment"

export default class TMDBService {

    constructor () {}

    private buildQuery(obj){
        return Object.keys(obj)
                .map(key => {
                return `${key}=${encodeURIComponent(obj[key])}`;
                })
                .join('&');
    }

    private isEmpty(str){
        return str == '' || str == undefined;
    }

    private async getGenresIDs(genres: String[]) {
        return [];
    }

    private async get(path: String, params: Object) {
        params = this.buildQuery({...params, api_key: env.TMDB_KEY});

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

    private async listMovies(name: String, genres: String[], year: String) {
        try {
            let data = [];
            if (this.isEmpty(name)) {
                data = await this.get("/search/movie", {query: name, year});
            } else {
                data = await this.get("/discover/movie", {genres: await this.getGenresIDs(genres), year: year});
            }
            
            return data;
        } catch {

        }
        return [];
    }

    private async listTvShows(name: String, genres: String[], year: String) {
        try {
            let uri = env.TMDB_URL + "/movie"

            const params = {
                year: "",
                with_genres: "",
                api_key: env.TMDB_KEY
            }
            const query = this.buildQuery(params);
            uri += `?${query}`;
            
            await axios.get(uri)
        } catch {

        }
        return [];
    }

    public async list(name: String, genres: String[], year: String, isMovie: String, isSeries: String) {
        let shows = [];

        if (isSeries === "1") {
            shows = shows.concat(await this.listTvShows(name, genres, year));
        }

        if (isMovie === "1") {
            shows = shows.concat(await this.listMovies(name, genres, year));
        }
        return shows;
    }
}