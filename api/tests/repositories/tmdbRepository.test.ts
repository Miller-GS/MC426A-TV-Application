// The idea of this test module is to check whether the correct parameters arrive at the get method in the tmdbRepository object.
// The point is to assume the axios request and the API are working and only test if we are using them correctly.

import TMDBRepository from "../../src/repositories/tmdbRepository";
import { MediaTypeEnum, TMDBMediaParser } from "../../src/models/tmdbMedia";
import { InvalidMediaTypeError } from "../../src/errors/InvalidMediaTypeError";

interface TMDBMedia {
    path: string;
    params: Object;
    popularity: number;
}

TMDBMediaParser.parseTv = (obj) => obj;
TMDBMediaParser.parseMovie = (obj) => obj;

class TMDBRepositoryTest extends TMDBRepository {
    private mockGetFunction: jest.Mock;

    constructor() {
        super();
        this.mockGetFunction = jest.fn();
    }

    public getMock() {
        return this.mockGetFunction;
    }

    public setMock(mock: jest.Mock) {
        this.mockGetFunction = mock;
    }

    protected async get(path: String, params: Object) {
        return this.mockGetFunction(path, params);
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

describe("TMDB Repository", () => {
    let tmdbRepository: TMDBRepositoryTest;

    beforeEach(() => {
        tmdbRepository = new TMDBRepositoryTest();

        tmdbRepository
            .getMock()
            .mockImplementation((path: String, params: Object) => {
                return {
                    results: [
                        {
                            path: path,
                            params: params,
                            popularity: 0,
                        } as TMDBMedia,
                    ],
                };
            });
    });

    describe("listMovies", () => {
        test("Should discover movie by year and genres", async () => {
            const params = makeMediaParamsMock({
                name: "",
                genres: "0,1,2",
                year: 2023,
                page: 1,
            });

            const response = await tmdbRepository.listMovies(params);
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

            const response = await tmdbRepository.listMovies(params);
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

            const response = await tmdbRepository.listMovies(params);
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

    describe("listTvShows", () => {
        test("Should discover tv by year, genres and vote ranges", async () => {
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

            const response = await tmdbRepository.listTvShows(params);
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

            const response = await tmdbRepository.listTvShows(params);
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

            const response = await tmdbRepository.listTvShows(params);
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

    describe("getMovie", () => {
        test("Should get movie by id", async () => {
            const response = await tmdbRepository.getMovie(1);
            const expected = {
                "results": [{
                    path: "/movie/1",
                    params: {},
                    popularity: 0,
                }],
            };

            expect(response).toEqual(expected);
        });
    });

    describe("getTVShow", () => {
        test("Should get tv show by id", async () => {
            const response = await tmdbRepository.getTVShow(1);
            const expected = {
                "results": [{
                    path: "/tv/1",
                    params: {},
                    popularity: 0,
                }],
            };

            expect(response).toEqual(expected);
        });
    });

    describe("getMedia", () => {
        test("Should get movie by id", async () => {
            const response = await tmdbRepository.getMedia(1, MediaTypeEnum.MOVIE);
            const expected = {
                "results": [{
                    path: "/movie/1",
                    params: {},
                    popularity: 0,
                }],
            };

            expect(response).toEqual(expected);
        });

        test("Should get tv show by id", async () => {
            const response = await tmdbRepository.getMedia(1, MediaTypeEnum.TV);
            const expected = {
                "results": [{
                    path: "/tv/1",
                    params: {},
                    popularity: 0,
                }],
            };

            expect(response).toEqual(expected);
        });

        test("Should throw error if media type is not supported", async () => {
            await expect(tmdbRepository.getMedia(1, "Something Else")).rejects.toThrowError(InvalidMediaTypeError);
        });
    });
});
