// The idea of this test module is to check whether the correct parameters arrive at the get method in the TMDBService object.
// The point is to assume the axios request and the API are working and only test if we are using them correctly.

import TMDBService from "../../src/services/tmdbService";
import { ShowParser } from "../../src/models/show";

interface Show {
    path: string;
    params: Object;
    popularity: number;
}

ShowParser.parseTv = (obj) => obj;
ShowParser.parseMovie = (obj) => obj;

class TMDBServiceTest extends TMDBService {
    protected async get(path: String, params: Object) {
        return [{ path: path, params: params, popularity: 0 } as Show];
    }
}

describe("TMDB Service - Movies", () => {
    let tmdbService: TMDBServiceTest;

    beforeEach(() => {
        tmdbService = new TMDBServiceTest();
    });

    test("Should discover movie by year and genres", async () => {
        const response = await tmdbService.list(
            "",
            "0,1,2",
            "2023",
            "1",
            "0",
            ""
        );
        const expected = {
            path: "/discover/movie",
            params: {
                with_genres: "0,1,2",
                year: "2023",
                sort_by: "popularity.desc",
                page: "1",
            },
            popularity: 0,
        };

        expect(response).toEqual([expected]);
    });

    test("Should search movie by name", async () => {
        const response = await tmdbService.list("X", "", "", "1", "", "1");
        const expected = {
            path: "/search/movie",
            params: {
                query: "X",
                year: "",
                page: "1",
            },
            popularity: 0,
        };

        expect(response).toEqual([expected]);
    });

    test("Should discover movie and go to page", async () => {
        const response = await tmdbService.list("", "0", "1999", "1", "0", "4");
        const expected = {
            path: "/discover/movie",
            params: {
                with_genres: "0",
                year: "1999",
                sort_by: "popularity.desc",
                page: "4",
            },
            popularity: 0,
        };

        expect(response).toEqual([expected]);
    });
});

describe("TMDB Service - TV", () => {
    let tmdbService: TMDBServiceTest;

    beforeEach(() => {
        tmdbService = new TMDBServiceTest();
    });

    test("Should discover tv by year and genres", async () => {
        const response = await tmdbService.list(
            "",
            "0,1,2",
            "2023",
            "0",
            "1",
            ""
        );
        const expected = {
            path: "/discover/tv",
            params: {
                with_genres: "0,1,2",
                first_air_date_year: "2023",
                sort_by: "popularity.desc",
                page: "1",
            },
            popularity: 0,
        };

        expect(response).toEqual([expected]);
    });

    test("Should search tv by name", async () => {
        const response = await tmdbService.list("X", "", "", "", "1", "1");
        const expected = {
            path: "/search/tv",
            params: {
                query: "X",
                first_air_date_year: "",
                page: "1",
            },
            popularity: 0,
        };

        expect(response).toEqual([expected]);
    });

    test("Should discover tv and go to page", async () => {
        const response = await tmdbService.list("", "0", "1999", "0", "1", "5");
        const expected = {
            path: "/discover/tv",
            params: {
                with_genres: "0",
                first_air_date_year: "1999",
                sort_by: "popularity.desc",
                page: "5",
            },
            popularity: 0,
        };

        expect(response).toEqual([expected]);
    });
});

describe("TMDB Service - Movie + TV", () => {
    let tmdbService: TMDBServiceTest;

    beforeEach(() => {
        tmdbService = new TMDBServiceTest();
    });

    test("Should discover movie + tv by year and genres", async () => {
        const response = await tmdbService.list(
            "",
            "0,1,2",
            "2023",
            "1",
            "1",
            ""
        );
        const expected = [
            {
                path: "/discover/tv",
                params: {
                    with_genres: "0,1,2",
                    first_air_date_year: "2023",
                    sort_by: "popularity.desc",
                    page: "1",
                },
                popularity: 0,
            },
            {
                path: "/discover/movie",
                params: {
                    with_genres: "0,1,2",
                    year: "2023",
                    sort_by: "popularity.desc",
                    page: "1",
                },
                popularity: 0,
            },
        ];

        expect(response).toEqual(expected);
    });

    test("Should search movie + tv by name", async () => {
        const response = await tmdbService.list("X", "", "", "1", "1", "1");
        const expected = [
            {
                path: "/search/tv",
                params: {
                    query: "X",
                    first_air_date_year: "",
                    page: "1",
                },
                popularity: 0,
            },
            {
                path: "/search/movie",
                params: {
                    query: "X",
                    year: "",
                    page: "1",
                },
                popularity: 0,
            },
        ];

        expect(response).toEqual(expected);
    });

    test("Should discover movie + tv and go to page", async () => {
        const response = await tmdbService.list("", "0", "1999", "1", "1", "6");
        const expected = [
            {
                path: "/discover/tv",
                params: {
                    with_genres: "0",
                    first_air_date_year: "1999",
                    sort_by: "popularity.desc",
                    page: "6",
                },
                popularity: 0,
            },
            {
                path: "/discover/movie",
                params: {
                    with_genres: "0",
                    year: "1999",
                    sort_by: "popularity.desc",
                    page: "6",
                },
                popularity: 0,
            },
        ];

        expect(response).toEqual(expected);
    });
});
