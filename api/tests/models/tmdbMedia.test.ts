import { TMDBMediaParser } from "../../src/models/tmdbMedia";

describe("parseTv", () => {
    test("Should return mediaType TV from empty object", () => {
        const obj = {};
        const tvShow = TMDBMediaParser.parseTv(obj);

        expect(tvShow).toEqual({ mediaType: "TV" });
    });

    test("Should return empty tv from undefined object", () => {
        const obj = undefined;
        const tvShow = TMDBMediaParser.parseTv(obj);

        expect(tvShow).toEqual({});
    });

    test("Should return images tv", () => {
        const obj = {
            original_title: "NAME",
            backdrop_path: "/BG",
            poster_path: "/POSTER",
        };
        const tvShow = TMDBMediaParser.parseTv(obj);

        expect(tvShow).toEqual({
            name: "NAME",
            backgroundImageUrl: "https://image.tmdb.org/t/p/original/BG",
            posterImageUrl: "https://image.tmdb.org/t/p/original/POSTER",
            mediaType: "TV",
        });
    });
});

describe("parseMovie", () => {
    test("Should return mediaType Movie from empty object", () => {
        const obj = {};
        const movie = TMDBMediaParser.parseMovie(obj);

        expect(movie).toEqual({ mediaType: "Movie" });
    });

    test("Should return empty movie from undefined object", () => {
        const obj = undefined;
        const movie = TMDBMediaParser.parseMovie(obj);

        expect(movie).toEqual({});
    });

    test("Should return images movie", () => {
        const obj = {
            original_title: "NAME",
            backdrop_path: "/BG",
            poster_path: "/POSTER",
        };
        const movie = TMDBMediaParser.parseMovie(obj);

        expect(movie).toEqual({
            name: "NAME",
            backgroundImageUrl: "https://image.tmdb.org/t/p/original/BG",
            posterImageUrl: "https://image.tmdb.org/t/p/original/POSTER",
            mediaType: "Movie",
        });
    });
});
