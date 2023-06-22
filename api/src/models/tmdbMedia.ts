import env from "../../environment";
import { ValidationUtils } from "../utils/validationUtils";

export class MediaTypeEnum {
    public static TV: string = "TV";
    public static MOVIE: string = "Movie";
}

export interface TMDBMedia {
    id: number;
    name: string;
    genres: number[];
    mediaType: string;

    description: string;
    language: string;
    releaseDate: string;

    backgroundImageUrl: string;
    posterImageUrl: string;

    popularity: number;
    tmdbVoteAverage: number;
    tmdbVoteCount: number;
}

export class TMDBMediaParser {
    static parseTv(tvObj: any): TMDBMedia {
        if (ValidationUtils.isNull(tvObj)) return {} as TMDBMedia;

        const tvShow = {
            id: tvObj.id,
            name: tvObj.original_title,
            genres: tvObj.genre_ids,
            description: tvObj.overview,
            language: tvObj.original_language,
            releaseDate: tvObj.first_air_date,
            popularity: tvObj.popularity,
            tmdbVoteAverage: tvObj.vote_average,
            tmdbVoteCount: tvObj.vote_count,
            mediaType: MediaTypeEnum.TV,
        } as TMDBMedia;

        Object.keys(tvShow).forEach(
            (key) => ValidationUtils.isNull(tvShow[key]) && delete tvShow[key]
        );

        if (!ValidationUtils.isEmpty(tvObj.backdrop_path)) {
            tvShow.backgroundImageUrl = `${env.TMDB_IMAGE_URL}${tvObj.backdrop_path}`;
        }
        if (!ValidationUtils.isEmpty(tvObj.poster_path)) {
            tvShow.posterImageUrl = `${env.TMDB_IMAGE_URL}${tvObj.poster_path}`;
        }

        return tvShow;
    }

    static parseMovie(movieObj: any): TMDBMedia {
        if (ValidationUtils.isNull(movieObj)) return {} as TMDBMedia;

        const movie = {
            id: movieObj.id,
            name: movieObj.original_title,
            genres: movieObj.genre_ids,
            description: movieObj.overview,
            language: movieObj.original_language,
            releaseDate: movieObj.release_date,
            popularity: movieObj.popularity,
            tmdbVoteAverage: movieObj.vote_average,
            tmdbVoteCount: movieObj.vote_count,
            mediaType: MediaTypeEnum.MOVIE,
        } as TMDBMedia;

        if (!ValidationUtils.isEmpty(movieObj.backdrop_path)) {
            movie.backgroundImageUrl = `${env.TMDB_IMAGE_URL}${movieObj.backdrop_path}`;
        }
        if (!ValidationUtils.isEmpty(movieObj.poster_path)) {
            movie.posterImageUrl = `${env.TMDB_IMAGE_URL}${movieObj.poster_path}`;
        }

        Object.keys(movie).forEach(
            (key) => ValidationUtils.isNull(movie[key]) && delete movie[key]
        );

        return movie;
    }
}
