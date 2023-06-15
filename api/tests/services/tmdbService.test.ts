// The idea of this test module is to check whether the correct parameters arrive at the get method in the TMDBService object.
// The point is to assume the axios request and the API are working and only test if we are using them correctly.

import TMDBService from "../../src/services/tmdbService";
import { TMDBMediaParser } from "../../src/models/tmdbMedia";
import { ListMediasParams } from "../../src/models/listMediasParams";

interface TMDBMedia {
    path: string;
    params: Object;
    popularity: number;
}

TMDBMediaParser.parseTv = (obj) => obj;
TMDBMediaParser.parseMovie = (obj) => obj;

class TMDBServiceTest extends TMDBService {
    protected async get(path: String, params: Object) {
        return [{ path: path, params: params, popularity: 0 } as TMDBMedia];
    }
}

const makeMediaParamsMock = (params = {} as any) => {
    return {
        name: params.name || undefined,
        genres: params.genres || undefined,
        year: params.year || undefined,
        minVoteAverage: params.minVoteAverage || undefined,
        maxVoteAverage: params.maxVoteAverage || undefined,
        minVoteCount: params.minVoteCount || undefined,
        maxVoteCount: params.maxVoteCount || undefined,
        page: params.page || undefined,
    };
};

describe("TMDB Service - Movies", () => {
    let tmdbService: TMDBServiceTest;

    beforeEach(() => {
        tmdbService = new TMDBServiceTest();
    });

    test("Should discover movie by year and genres", async () => {
        const params = makeMediaParamsMock({
            name: "",
            genres: "0,1,2",
            year: 2023,
            page: 1,
        });

        const response = await tmdbService.list(params, "1", "0");
        const expected = {
            path: "/discover/movie",
            params: {
                with_genres: "0,1,2",
                year: 2023,
                sort_by: "popularity.desc",
                page: 1,
                "vote_average.gte": undefined,
                "vote_average.lte": undefined,
                "vote_count.gte": undefined,
                "vote_count.lte": undefined,
            },
            popularity: 0,
        };

        expect(response).toEqual([expected]);
    });

    test("Should search movie by name", async () => {
        const params = makeMediaParamsMock({
            name: "X",
            genres: "0,1,2",
            page: 1,
        });

        const response = await tmdbService.list(params, "1", "");
        const expected = {
            path: "/search/movie",
            params: {
                query: "X",
                year: undefined,
                page: 1,
            },
            popularity: 0,
        };

        expect(response).toEqual([expected]);
    });

    test("Should discover movie and go to page", async () => {
        const params = makeMediaParamsMock({
            name: "",
            genres: "0",
            year: 1999,
            minVoteAverage: 5.0,
            minVoteCount: 5,
            page: 4,
        });

        const response = await tmdbService.list(params, "1", "0");
        const expected = {
            path: "/discover/movie",
            params: {
                with_genres: "0",
                year: 1999,
                sort_by: "popularity.desc",
                page: 4,
                "vote_average.gte": 5.0,
                "vote_count.gte": 5,
                "vote_average.lte": undefined,
                "vote_count.lte": undefined,
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
        const params = makeMediaParamsMock({
            name: "",
            genres: "0,1,2",
            year: 2023,
            minVoteAverage: 5.0,
            maxVoteAverage: 9.0,
            minVoteCount: 5,
            maxVoteCount: 1000,
            page: 1,
        });

        const response = await tmdbService.list(params, "0", "1");
        const expected = {
            path: "/discover/tv",
            params: {
                with_genres: "0,1,2",
                first_air_date_year: 2023,
                sort_by: "popularity.desc",
                page: 1,
                "vote_average.gte": 5.0,
                "vote_average.lte": 9.0,
                "vote_count.gte": 5,
                "vote_count.lte": 1000,
            },
            popularity: 0,
        };

        expect(response).toEqual([expected]);
    });

    test("Should search tv by name", async () => {
        const params = makeMediaParamsMock({
            name: "X",
            page: 1,
        });

        const response = await tmdbService.list(params, "", "1");
        const expected = {
            path: "/search/tv",
            params: {
                query: "X",
                first_air_date_year: undefined,
                page: 1,
            },
            popularity: 0,
        };

        expect(response).toEqual([expected]);
    });

    test("Should discover tv and go to page", async () => {
        const params = makeMediaParamsMock({
            name: "",
            genres: "0",
            year: 1999,
            page: 5,
        });

        const response = await tmdbService.list(params, "0", "1");
        const expected = {
            path: "/discover/tv",
            params: {
                with_genres: "0",
                first_air_date_year: 1999,
                sort_by: "popularity.desc",
                page: 5,
                "vote_average.gte": undefined,
                "vote_average.lte": undefined,
                "vote_count.gte": undefined,
                "vote_count.lte": undefined,
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
        const params = makeMediaParamsMock({
            name: "",
            genres: "0,1,2",
            year: 2016,
            page: 5,
        });

        const response = await tmdbService.list(params, "1", "1");
        const expected = [
            {
                path: "/discover/tv",
                params: {
                    with_genres: "0,1,2",
                    first_air_date_year: 2016,
                    sort_by: "popularity.desc",
                    page: 5,
                    "vote_average.gte": undefined,
                    "vote_average.lte": undefined,
                    "vote_count.gte": undefined,
                    "vote_count.lte": undefined,
                },
                popularity: 0,
            },
            {
                path: "/discover/movie",
                params: {
                    with_genres: "0,1,2",
                    year: 2016,
                    sort_by: "popularity.desc",
                    page: 5,
                    "vote_average.gte": undefined,
                    "vote_average.lte": undefined,
                    "vote_count.gte": undefined,
                    "vote_count.lte": undefined,
                },
                popularity: 0,
            },
        ];

        expect(response).toEqual(expected);
    });

    test("Should search movie + tv by name", async () => {
        const params = makeMediaParamsMock({
            name: "X",
            page: 3,
        });

        const response = await tmdbService.list(params, "1", "1");
        const expected = [
            {
                path: "/search/tv",
                params: {
                    query: "X",
                    first_air_date_year: undefined,
                    page: 3,
                },
                popularity: 0,
            },
            {
                path: "/search/movie",
                params: {
                    query: "X",
                    year: undefined,
                    page: 3,
                },
                popularity: 0,
            },
        ];

        expect(response).toEqual(expected);
    });

    test("Should discover movie + tv and go to page", async () => {
        const params = makeMediaParamsMock({
            name: "",
            genres: "0",
            year: 1999,
            page: 6,
        });

        const response = await tmdbService.list(params, "1", "1");
        const expected = [
            {
                path: "/discover/tv",
                params: {
                    with_genres: "0",
                    first_air_date_year: 1999,
                    sort_by: "popularity.desc",
                    page: 6,
                    "vote_average.gte": undefined,
                    "vote_average.lte": undefined,
                    "vote_count.gte": undefined,
                    "vote_count.lte": undefined,
                },
                popularity: 0,
            },
            {
                path: "/discover/movie",
                params: {
                    with_genres: "0",
                    year: 1999,
                    sort_by: "popularity.desc",
                    page: 6,
                    "vote_average.gte": undefined,
                    "vote_average.lte": undefined,
                    "vote_count.gte": undefined,
                    "vote_count.lte": undefined,
                },
                popularity: 0,
            },
        ];

        expect(response).toEqual(expected);
    });
});
