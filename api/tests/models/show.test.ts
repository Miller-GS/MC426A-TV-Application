import { ShowParser } from "../../src/models/show";

describe("parseTv", () => {
    test("Should return showType TV from empty object", () => {
        const obj = {};
        const show = ShowParser.parseTv(obj);

        expect(show).toEqual({ showType: "TV" });
    });

    test("Should return empty tv from undefined object", () => {
        const obj = undefined;
        const show = ShowParser.parseTv(obj);

        expect(show).toEqual({});
    });

    test("Should return images tv", () => {
        const obj = {
            original_title: "NAME",
            backdrop_path: "/BG",
            poster_path: "/POSTER",
        };
        const show = ShowParser.parseTv(obj);

        expect(show).toEqual({
            name: "NAME",
            backgroundImageUrl: "https://image.tmdb.org/t/p/original/BG",
            posterImageUrl: "https://image.tmdb.org/t/p/original/POSTER",
            showType: "TV",
        });
    });
});

describe("parseMovie", () => {
    test("Should return showType Movie from empty object", () => {
        const obj = {};
        const show = ShowParser.parseMovie(obj);

        expect(show).toEqual({ showType: "Movie" });
    });

    test("Should return empty movie from undefined object", () => {
        const obj = undefined;
        const show = ShowParser.parseMovie(obj);

        expect(show).toEqual({});
    });

    test("Should return images movie", () => {
        const obj = {
            original_title: "NAME",
            backdrop_path: "/BG",
            poster_path: "/POSTER",
        };
        const show = ShowParser.parseMovie(obj);

        expect(show).toEqual({
            name: "NAME",
            backgroundImageUrl: "https://image.tmdb.org/t/p/original/BG",
            posterImageUrl: "https://image.tmdb.org/t/p/original/POSTER",
            showType: "Movie",
        });
    });
});
