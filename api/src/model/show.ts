import env from "../../environment";

export class ShowTypeEnum {
    public static TV: string = "TV";
    public static MOVIE: string = "Movie";
}

export interface Show {
    id: number;
    name: string;
    genres: number[];

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
        const show = {
            id: tvObj.id,
            name: tvObj.original_title,
            genres: tvObj.genre_ids,
            description: tvObj.overview,
            language: tvObj.original_language,
            releaseDate: tvObj.first_air_date,
            backgroundImageUrl: `${env.TMDB_IMAGE_URL}${tvObj.backdrop_path}`,
            posterImageUrl: `${env.TMDB_IMAGE_URL}${tvObj.poster_path}`,
            popularity: tvObj.popularity,
            voteAverage: tvObj.vote_average,
            voteCount: tvObj.vote_count,
            showType: ShowTypeEnum.TV,
        };

        return show;
    }

    static parseMovie(movieObj: any): Show {
        const show = {
            id: movieObj.id,
            name: movieObj.original_title,
            genres: movieObj.genre_ids,
            description: movieObj.overview,
            language: movieObj.original_language,
            releaseDate: movieObj.release_date,
            backgroundImageUrl: `${env.TMDB_IMAGE_URL}${movieObj.backdrop_path}`,
            posterImageUrl: `${env.TMDB_IMAGE_URL}${movieObj.poster_path}`,
            popularity: movieObj.popularity,
            voteAverage: movieObj.vote_average,
            voteCount: movieObj.vote_count,
            showType: ShowTypeEnum.MOVIE,
        };

        return show;
    }
}
