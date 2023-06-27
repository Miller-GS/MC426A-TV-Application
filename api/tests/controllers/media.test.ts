import { Request, Response } from "express";

import { MediaController } from "../../src/controllers/media";
import MediaService from "../../src/services/mediaService";
import { TMDBMediaParser, TMDBMedia } from "../../src/models/tmdbMedia";
import { ListMediasParams } from "../../src/models/listMediasParams";
import { MediaNotFoundError } from "../../src/errors/MediaNotFoundError";

class MediaServiceMock extends MediaService {
    static tvShows = [
        TMDBMediaParser.parseTv({ id: 1 }),
        TMDBMediaParser.parseTv({ id: 2 }),
    ];
    static movies = [
        TMDBMediaParser.parseMovie({ id: 3 }),
        TMDBMediaParser.parseMovie({ id: 4 }),
    ];

    static medias = MediaServiceMock.tvShows.concat(MediaServiceMock.movies);

    public async list(
        params: ListMediasParams,
        includeMovie: boolean,
        includeTvShows: boolean
    ) {
        let ret: TMDBMedia[] = [];

        if (includeTvShows) ret = ret.concat(MediaServiceMock.tvShows);
        if (includeMovie) ret = ret.concat(MediaServiceMock.movies);

        return ret;
    }

    public async getMedia(mediaId: number) {
        return MediaServiceMock.tvShows[0];
    }
}

class MediaServiceMockError extends MediaService {
    public async list(
        params: ListMediasParams,
        includeMovie: boolean,
        includeTvShows: boolean
    ) {
        throw new Error("error");
        return [] as TMDBMedia[];
    }

    public async getMedia(mediaId: number) {
        throw new MediaNotFoundError();
        return {} as TMDBMedia;
    }
}

describe("Tv controller", () => {
    let mediaController: MediaController;
    let tmdbRepositoryMock: any;
    let mediaRepositoryMock: any;

    beforeEach(() => {
        tmdbRepositoryMock = {};
        mediaRepositoryMock = {
            find: jest.fn(),
            save: jest.fn(),
        };
        mediaController = new MediaController(
            new MediaServiceMock(mediaRepositoryMock, tmdbRepositoryMock)
        );
    });

    describe("listMedias", () => {
        test("Should return 200 with list of tv shows", async () => {
            const mockRequest = {
                query: {
                    includeTvShows: "1",
                    includeMovies: "0",
                },
            } as unknown as Request;

            const mockResponse = {} as unknown as Response;
            mockResponse.json = jest.fn(() => mockResponse);
            mockResponse.status = jest.fn(() => mockResponse);

            await mediaController.listMedias(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                MediaServiceMock.tvShows
            );
        });

        test("Should return 200 with list of movies", async () => {
            const mockRequest = {
                query: {
                    includeMovies: "1",
                },
            } as unknown as Request;

            const mockResponse = {} as unknown as Response;
            mockResponse.json = jest.fn(() => mockResponse);
            mockResponse.status = jest.fn(() => mockResponse);

            await mediaController.listMedias(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                MediaServiceMock.movies
            );
        });

        test("Should return 200 with list of all medias", async () => {
            const mockRequest = {
                query: {
                    includeTvShows: "1",
                    includeMovies: "1",
                },
            } as unknown as Request;

            const mockResponse = {} as unknown as Response;
            mockResponse.json = jest.fn(() => mockResponse);
            mockResponse.status = jest.fn(() => mockResponse);

            await mediaController.listMedias(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                MediaServiceMock.medias
            );
        });

        test("Should return 400 with empty request", async () => {
            const mockRequest = {
                query: {},
            } as unknown as Request;

            const mockResponse = {} as unknown as Response;
            mockResponse.json = jest.fn(() => mockResponse);
            mockResponse.status = jest.fn(() => mockResponse);

            await mediaController.listMedias(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message:
                    "You must provide least one of the following query parameters: includeMovies=1, includeTvShows=1",
            });
        });

        test("Should return 400 with undefined request", async () => {
            const mockRequest = {
                query: undefined,
            } as unknown as Request;

            const mockResponse = {} as unknown as Response;
            mockResponse.json = jest.fn(() => mockResponse);
            mockResponse.status = jest.fn(() => mockResponse);

            await mediaController.listMedias(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Bad request: Query was undefined",
            });
        });

        test("Should return 400 with request with neither movies nor tvShows", async () => {
            const mockRequest = {
                query: {
                    includeTvShows: "0",
                    includeMovies: 0,
                },
            } as unknown as Request;

            const mockResponse = {} as unknown as Response;
            mockResponse.json = jest.fn(() => mockResponse);
            mockResponse.status = jest.fn(() => mockResponse);

            await mediaController.listMedias(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message:
                    "You must provide least one of the following query parameters: includeMovies=1, includeTvShows=1",
            });
        });

        test("Should return 500 with error in service", async () => {
            const mediaControllerError = new MediaController(
                new MediaServiceMockError(
                    tmdbRepositoryMock,
                    mediaRepositoryMock
                )
            );
            const mockRequest = {
                query: {
                    includeTvShows: "1",
                },
            } as unknown as Request;

            const mockResponse = {} as unknown as Response;
            mockResponse.send = jest.fn(() => mockResponse);
            mockResponse.status = jest.fn(() => mockResponse);

            await mediaControllerError.listMedias(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith({ error: "error" });
        });
    });

    describe("getMedia", () => {
        test("Should return 200 with correct id", async () => {
            const mockRequest = {
                params: {
                    id: "1",
                },
            } as unknown as Request;

            const mockResponse = {} as unknown as Response;
            mockResponse.json = jest.fn(() => mockResponse);
            mockResponse.status = jest.fn(() => mockResponse);

            await mediaController.getMedia(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                MediaServiceMock.tvShows[0]
            );
        });

        test("Should return 400 with no id", async () => {
            const mockRequest = {
                params: {},
            } as unknown as Request;

            const mockResponse = {} as unknown as Response;
            mockResponse.json = jest.fn(() => mockResponse);
            mockResponse.status = jest.fn(() => mockResponse);

            await mediaController.getMedia(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Bad request: Media id was undefined",
            });
        });

        test("Should return 404 with not existing id", async () => {
            const mockRequest = {
                params: {
                    id: "1",
                },
            } as unknown as Request;

            const mockResponse = {} as unknown as Response;
            mockResponse.json = jest.fn(() => mockResponse);
            mockResponse.status = jest.fn(() => mockResponse);

            const mediaControllerError = new MediaController(
                new MediaServiceMockError(
                    tmdbRepositoryMock,
                    mediaRepositoryMock
                )
            );

            await mediaControllerError.getMedia(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Media not found",
            });
        });
    });
});
