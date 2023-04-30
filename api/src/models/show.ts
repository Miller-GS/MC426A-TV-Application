import env from "../../environment";
import { ValidationUtils } from "../utils/validationUtils";

export class ShowTypeEnum {
    public static TV: string = "TV";
    public static MOVIE: string = "Movie";
}

export interface Show {
    id: number;
    name: string;
    genres: number[];
    showType: string;

    description: string;
    language: string;
    releaseDate: string;

    backgroundImageUrl: string;
    posterImageUrl: string;

    popularity: number;
    voteAverage: number;
    voteCount: number;
}

export class ShowParser {
    static parseTv(tvObj: any): Show {
        if (tvObj === undefined) return {} as Show;

        const show = {
            id: tvObj.id,
            name: tvObj.original_title,
            genres: tvObj.genre_ids,
            description: tvObj.overview,
            language: tvObj.original_language,
            releaseDate: tvObj.first_air_date,
            popularity: tvObj.popularity,
            voteAverage: tvObj.vote_average,
            voteCount: tvObj.vote_count,
            showType: ShowTypeEnum.TV,
        } as Show;

        Object.keys(show).forEach(
            (key) => show[key] === undefined && delete show[key]
        );

        if (!ValidationUtils.isEmpty(tvObj.backdrop_path)) {
            show.backgroundImageUrl = `${env.TMDB_IMAGE_URL}${tvObj.backdrop_path}`;
        }
        if (!ValidationUtils.isEmpty(tvObj.poster_path)) {
            show.posterImageUrl = `${env.TMDB_IMAGE_URL}${tvObj.poster_path}`;
        }

        return show;
    }

    static parseMovie(movieObj: any): Show {
        if (movieObj === undefined) return {} as Show;

        const show = {
            id: movieObj.id,
            name: movieObj.original_title,
            genres: movieObj.genre_ids,
            description: movieObj.overview,
            language: movieObj.original_language,
            releaseDate: movieObj.release_date,
            popularity: movieObj.popularity,
            voteAverage: movieObj.vote_average,
            voteCount: movieObj.vote_count,
            showType: ShowTypeEnum.MOVIE,
        } as Show;

        if (!ValidationUtils.isEmpty(movieObj.backdrop_path)) {
            show.backgroundImageUrl = `${env.TMDB_IMAGE_URL}${movieObj.backdrop_path}`;
        }
        if (!ValidationUtils.isEmpty(movieObj.poster_path)) {
            show.posterImageUrl = `${env.TMDB_IMAGE_URL}${movieObj.poster_path}`;
        }

        Object.keys(show).forEach(
            (key) => show[key] === undefined && delete show[key]
        );

        return show;
    }
}
