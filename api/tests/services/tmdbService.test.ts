import TMDBService from "../../src/services/tmdbService";

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

describe("TMDB Service", () => {
    let tmdbRepositoryMock: any;
    let tmdbService: TMDBService;

    beforeEach(() => {
        tmdbRepositoryMock = {
            listMovies: jest.fn(),
            listTvShows: jest.fn(),
        };
        tmdbRepositoryMock.listMovies.mockResolvedValue([
            {
                title: "movie1",
                popularity: 1,
            },
            {
                title: "movie2",
                popularity: 3,
            },
        ]);
        tmdbRepositoryMock.listTvShows.mockResolvedValue([
            {
                title: "tv1",
                popularity: 2,
            },
            {
                title: "tv2",
                popularity: 4,
            },
        ]);
        tmdbService = new TMDBService(tmdbRepositoryMock);
    });

    describe("list", () => {
        test("Should return only movies when includeMovies is true and includeTvShows is false, sorted by popularity", async () => {
            const paramsMock = makeMediaParamsMock();
            const result = await tmdbService.list(paramsMock, true, false);

            expect(result).toEqual([
                {
                    title: "movie2",
                    popularity: 3,
                },
                {
                    title: "movie1",
                    popularity: 1,
                },
            ]);

            expect(tmdbRepositoryMock.listMovies).toHaveBeenCalledWith(
                paramsMock
            );
            expect(tmdbRepositoryMock.listTvShows).not.toHaveBeenCalled();
        });

        test("Should return only tv shows when includeMovies is false and includeTvShows is true, sorted by popularity", async () => {
            const paramsMock = makeMediaParamsMock();
            const result = await tmdbService.list(paramsMock, false, true);

            expect(result).toEqual([
                {
                    title: "tv2",
                    popularity: 4,
                },
                {
                    title: "tv1",
                    popularity: 2,
                },
            ]);

            expect(tmdbRepositoryMock.listMovies).not.toHaveBeenCalled();
            expect(tmdbRepositoryMock.listTvShows).toHaveBeenCalledWith(
                paramsMock
            );
        });

        test("Should return movies and tv shows when includeMovies and includeTvShows are true, sorted by popularity", async () => {
            const paramsMock = makeMediaParamsMock();
            const result = await tmdbService.list(paramsMock, true, true);

            expect(result).toEqual([
                {
                    title: "tv2",
                    popularity: 4,
                },
                {
                    title: "movie2",
                    popularity: 3,
                },
                {
                    title: "tv1",
                    popularity: 2,
                },
                {
                    title: "movie1",
                    popularity: 1,
                },
            ]);

            expect(tmdbRepositoryMock.listMovies).toHaveBeenCalledWith(
                paramsMock
            );
            expect(tmdbRepositoryMock.listTvShows).toHaveBeenCalledWith(
                paramsMock
            );
        });

        test("Should return empty array when includeMovies and includeTvShows are false", async () => {
            const paramsMock = makeMediaParamsMock();
            const result = await tmdbService.list(paramsMock, false, false);

            expect(result).toEqual([]);

            expect(tmdbRepositoryMock.listMovies).not.toHaveBeenCalled();
            expect(tmdbRepositoryMock.listTvShows).not.toHaveBeenCalled();
        });
    });
});
