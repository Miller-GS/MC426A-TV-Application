import { Request, Response } from "express";

import { MediaController } from "../../src/controllers/media";
import TMDBService from "../../src/services/tmdbService";
import { TMDBMediaParser, TMDBMedia } from "../../src/models/tmdbMedia";
import { ListMediasParams } from "../../src/models/listMediasParams";

class TMDBServiceMock extends TMDBService {
    static tvShows = [
        TMDBMediaParser.parseTv({ id: 1 }),
        TMDBMediaParser.parseTv({ id: 2 }),
    ];
    static movies = [
        TMDBMediaParser.parseMovie({ id: 3 }),
        TMDBMediaParser.parseMovie({ id: 4 }),
    ];

    static medias = TMDBServiceMock.tvShows.concat(TMDBServiceMock.movies);

    public async list(
        params: ListMediasParams,
        includeMovie: boolean,
        includeTvShows: boolean
    ) {
        let ret: TMDBMedia[] = [];

        if (includeTvShows) ret = ret.concat(TMDBServiceMock.tvShows);
        if (includeMovie) ret = ret.concat(TMDBServiceMock.movies);

        return ret;
    }
}

class TMDBServiceMockError extends TMDBService {
    public async list(
        params: ListMediasParams,
        includeMovie: boolean,
        includeTvShows: boolean
    ) {
        throw new Error("error");
        return [] as TMDBMedia[];
    }
}

describe("Tv controller", () => {
    let mediaController: MediaController;
    let tmdbRepositoryMock: any;

    beforeEach(() => {
        tmdbRepositoryMock = {};
        mediaController = new MediaController(new TMDBServiceMock(tmdbRepositoryMock));
    });

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
        expect(mockResponse.json).toHaveBeenCalledWith(TMDBServiceMock.tvShows);
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
        expect(mockResponse.json).toHaveBeenCalledWith(TMDBServiceMock.movies);
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
        expect(mockResponse.json).toHaveBeenCalledWith(TMDBServiceMock.medias);
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
            new TMDBServiceMockError(tmdbRepositoryMock)
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
