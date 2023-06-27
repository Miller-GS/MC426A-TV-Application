import { MediaNotFoundError } from "../../src/errors/MediaNotFoundError";
import { MediaTypeEnum } from "../../src/models/tmdbMedia";
import MediaService from "../../src/services/mediaService";

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
    let mediaRepositoryMock: any;
    let tmdbRepositoryMock: any;
    let mediaService: MediaService;

    beforeEach(() => {
        mediaRepositoryMock = {
            findOne: jest.fn(),
            save: jest.fn(),
        };
        tmdbRepositoryMock = {
            listMovies: jest.fn(),
            listTvShows: jest.fn(),
            getMedia: jest.fn(),
        };
        tmdbRepositoryMock.listMovies.mockResolvedValue([
            {
                externalId: 1000,
                title: "movie1",
                popularity: 1,
                mediaType: MediaTypeEnum.MOVIE,
            },
            {
                externalId: 1001,
                title: "movie2",
                popularity: 3,
                mediaType: MediaTypeEnum.MOVIE,
            },
        ]);
        tmdbRepositoryMock.listTvShows.mockResolvedValue([
            {
                externalId: 2000,
                title: "tv1",
                popularity: 2,
                mediaType: MediaTypeEnum.TV,
            },
            {
                externalId: 2001,
                title: "tv2",
                popularity: 4,
                mediaType: MediaTypeEnum.TV,
            },
        ]);
        mediaService = new MediaService(mediaRepositoryMock, tmdbRepositoryMock);
    });

    describe("list", () => {
        test("Should return movies when includeMovies is true, with Media ID when it exists, sorted by popularity", async () => {
            const paramsMock = makeMediaParamsMock();
            mediaRepositoryMock.findOne.mockResolvedValueOnce({
                Id: 1,
            });
            mediaRepositoryMock.findOne.mockResolvedValueOnce({
                Id: 2,
            });
            const result = await mediaService.list(paramsMock, true, false);

            expect(result).toEqual([
                {
                    id: 2,
                    externalId: 1001,
                    title: "movie2",
                    popularity: 3,
                    mediaType: MediaTypeEnum.MOVIE,
                },
                {
                    id: 1,
                    externalId: 1000,
                    title: "movie1",
                    popularity: 1,
                    mediaType: MediaTypeEnum.MOVIE,
                },
            ]);

            expect(tmdbRepositoryMock.listMovies).toHaveBeenCalledWith(
                paramsMock
            );
            expect(tmdbRepositoryMock.listTvShows).not.toHaveBeenCalled();
        });

        test("Should return only tv shows when includeTvShows is true, with Media ID when it exists, sorted by popularity", async () => {
            const paramsMock = makeMediaParamsMock();
            const result = await mediaService.list(paramsMock, false, true);

            mediaRepositoryMock.findOne.mockResolvedValueOnce({
                Id: 3,
            });
            mediaRepositoryMock.findOne.mockResolvedValueOnce({
                Id: 4,
            });

            expect(result).toEqual([
                {
                    id: 4,
                    title: "tv2",
                    popularity: 4,
                    mediaType: MediaTypeEnum.TV,
                },
                {
                    id: 3,
                    title: "tv1",
                    popularity: 2,
                    mediaType: MediaTypeEnum.TV,
                },
            ]);

            expect(tmdbRepositoryMock.listMovies).not.toHaveBeenCalled();
            expect(tmdbRepositoryMock.listTvShows).toHaveBeenCalledWith(
                paramsMock
            );
        });

        test("Should return movies and tv shows when both flags are true, with Media ID when it exists, sorted by popularity", async () => {
            const paramsMock = makeMediaParamsMock();
            const result = await mediaService.list(paramsMock, true, true);

            mediaRepositoryMock.findOne.mockResolvedValueOnce({
                Id: 3,
            });
            mediaRepositoryMock.findOne.mockResolvedValueOnce({
                Id: 4,
            });
            mediaRepositoryMock.findOne.mockResolvedValueOnce({
                Id: 1,
            });
            mediaRepositoryMock.findOne.mockResolvedValueOnce({
                Id: 2,
            });

            expect(result).toEqual([
                {
                    id: 4,
                    title: "tv2",
                    popularity: 4,
                    mediaType: MediaTypeEnum.TV,
                },
                {
                    id: 2,
                    title: "movie2",
                    popularity: 3,
                    mediaType: MediaTypeEnum.MOVIE,
                },
                {
                    id: 3,
                    title: "tv1",
                    popularity: 2,
                    mediaType: MediaTypeEnum.TV,
                },
                {
                    id: 1,
                    title: "movie1",
                    popularity: 1,
                    mediaType: MediaTypeEnum.MOVIE,
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
            const result = await mediaService.list(paramsMock, false, false);

            expect(result).toEqual([]);

            expect(tmdbRepositoryMock.listMovies).not.toHaveBeenCalled();
            expect(tmdbRepositoryMock.listTvShows).not.toHaveBeenCalled();
        });
    });

    describe("getMedia", () => {
        beforeEach(() => {
            tmdbRepositoryMock.getMedia.mockResolvedValue({
                externalId: 1000,
            });
        });

        test("Should return movie when given existing id", async () => {
            mediaRepositoryMock.findOne.mockReturnValue({
                Id: 1,
                ExternalId: 1000,
                Type: MediaTypeEnum.MOVIE,
            });

            const response = await mediaService.getMedia(1);

            expect(response).toEqual({
                id: 1,
                externalId: 1000,
            });
        });

        test("Should return TV series when given existing id", async () => {
            mediaRepositoryMock.findOne.mockReturnValue({
                Id: 1,
                ExternalId: 1000,
                Type: MediaTypeEnum.TV,
            });

            const response = await mediaService.getMedia(1);

            expect(response).toEqual({
                id: 1,
                externalId: 1000,
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
