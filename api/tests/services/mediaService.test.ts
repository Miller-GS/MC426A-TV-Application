// The idea of this test module is to check whether the correct parameters arrive at the get method in the mediaService object.
// The point is to assume the axios request and the API are working and only test if we are using them correctly.

import MediaService from "../../src/services/mediaService";
import { MediaTypeEnum, TMDBMediaParser } from "../../src/models/tmdbMedia";
import { MediaNotFoundError } from "../../src/errors/MediaNotFoundError";

interface TMDBMedia {
    path: string;
    params: Object;
    popularity: number;
}

TMDBMediaParser.parseTv = (obj) => obj;
TMDBMediaParser.parseMovie = (obj) => obj;

class MediaServiceTest extends MediaService {
    private mockGetFunction: jest.Mock;

    constructor(mediaRepository: any) {
        super(mediaRepository);
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

describe("Media Service", () => {
    let mediaService: MediaServiceTest;
    let mediaRepositoryMock: any;

    beforeEach(() => {
        mediaRepositoryMock = {
            findOne: jest.fn(),
            save: jest.fn(),
        };
        mediaRepositoryMock.findOne.mockReturnValue({
            Id: 1,
        });
        mediaService = new MediaServiceTest(mediaRepositoryMock);

        mediaService
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

    describe("list - Movies", () => {
        test("Should discover movie by year and genres", async () => {
            const params = makeMediaParamsMock({
                name: "",
                genres: "0,1,2",
                year: 2023,
                page: 1,
            });

            const response = await mediaService.list(params, true, false);
            const expected = {
                id: 1,
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

            const response = await mediaService.list(params, true, false);
            const expected = {
                id: 1,
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

            const response = await mediaService.list(params, true, false);
            const expected = {
                id: 1,
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

        test("Should save new movies into the Media database", async () => {
            const params = makeMediaParamsMock({
                name: "",
                genres: "0",
                year: 1999,
                minVoteAverage: 5.0,
                minVoteCount: 5,
                page: 4,
            });
            mediaRepositoryMock.findOne.mockReturnValue(undefined);
            mediaRepositoryMock.save.mockReturnValue({
                Id: 1,
            });

            await mediaService.list(params, true, false);

            expect(mediaRepositoryMock.save).toHaveBeenCalledTimes(1);
        });
    });

    describe("list - TV", () => {
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

            const response = await mediaService.list(params, false, true);
            const expected = {
                id: 1,
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

            const response = await mediaService.list(params, false, true);
            const expected = {
                id: 1,
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

            const response = await mediaService.list(params, false, true);
            const expected = {
                id: 1,
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

        test("Should save new TV series into the Media database", async () => {
            const params = makeMediaParamsMock({
                name: "",
                genres: "0",
                year: 1999,
                minVoteAverage: 5.0,
                minVoteCount: 5,
                page: 4,
            });
            mediaRepositoryMock.findOne.mockReturnValue(undefined);
            mediaRepositoryMock.save.mockReturnValue({
                Id: 1,
            });

            await mediaService.list(params, false, true);

            expect(mediaRepositoryMock.save).toHaveBeenCalledTimes(1);
        });
    });

    describe("list - Movie + TV", () => {
        test("Should discover movie + tv by year, genres and vote ranges", async () => {
            const params = makeMediaParamsMock({
                name: "",
                genres: "0,1,2",
                year: 2016,
                maxVoteAverage: 6.9,
                minVoteAverage: 5.0,
                maxVoteCount: 100,
                minVoteCount: 5,
                page: 5,
            });

            const response = await mediaService.list(params, true, true);
            const expected = [
                {
                    id: 1,
                    path: "/discover/tv",
                    params: {
                        with_genres: "0,1,2",
                        first_air_date_year: 2016,
                        sort_by: "popularity.desc",
                        page: 5,
                        "vote_average.gte": 5.0,
                        "vote_average.lte": 6.9,
                        "vote_count.gte": 5,
                        "vote_count.lte": 100,
                    },
                    popularity: 0,
                },
                {
                    id: 1,
                    path: "/discover/movie",
                    params: {
                        with_genres: "0,1,2",
                        year: 2016,
                        sort_by: "popularity.desc",
                        page: 5,
                        "vote_average.gte": 5.0,
                        "vote_average.lte": 6.9,
                        "vote_count.gte": 5,
                        "vote_count.lte": 100,
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

            const response = await mediaService.list(params, true, true);
            const expected = [
                {
                    id: 1,
                    path: "/search/tv",
                    params: {
                        query: "X",
                        first_air_date_year: undefined,
                        page: 3,
                    },
                    popularity: 0,
                },
                {
                    id: 1,
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

            const response = await mediaService.list(params, true, true);
            const expected = [
                {
                    id: 1,
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
                    id: 1,
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

    describe("getMedia", () => {
        beforeEach(() => {
            const getMockFunction = jest.fn();
            getMockFunction.mockReturnValue({
                id: 1,
            });
            mediaService.setMock(getMockFunction);
        });

        test("Should return movie when given existing id", async () => {
            mediaRepositoryMock.findOne.mockReturnValue({
                Id: 1,
                Type: MediaTypeEnum.MOVIE,
            });

            const response = await mediaService.getMedia(1);

            expect(response).toEqual({
                id: 1,
            });
        });

        test("Should return TV series when given existing id", async () => {
            mediaRepositoryMock.findOne.mockReturnValue({
                Id: 1,
                Type: MediaTypeEnum.TV,
            });

            const response = await mediaService.getMedia(1);

            expect(response).toEqual({
                id: 1,
            });
        });

        test("Should throw MediaNotFoundError when given non-existing id", async () => {
            mediaRepositoryMock.findOne.mockReturnValue(undefined);

            await expect(mediaService.getMedia(1)).rejects.toThrow(
                MediaNotFoundError
            );
        });
    });
});
