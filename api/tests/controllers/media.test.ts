import { Request, Response } from "express";

import { MediaController } from "../../src/controllers/media";
import TMDBService from "../../src/services/tmdbService";
import { TMDBMediaParser, TMDBMedia } from "../../src/models/tmdbMedia";
import { ListMediasParams } from "../../src/models/listMediasParams";

class TMDBServiceMock extends TMDBService {
    static series = [
        TMDBMediaParser.parseTv({ id: 1 }),
        TMDBMediaParser.parseTv({ id: 2 }),
    ];
    static movies = [
        TMDBMediaParser.parseMovie({ id: 3 }),
        TMDBMediaParser.parseMovie({ id: 4 }),
    ];

    static medias = TMDBServiceMock.series.concat(TMDBServiceMock.movies);

    public async list(
        params: ListMediasParams,
        includeMovie: String,
        includeSeries: String
    ) {
        let ret: TMDBMedia[] = [];

        if (includeSeries === "1") ret = ret.concat(TMDBServiceMock.series);
        if (includeMovie === "1") ret = ret.concat(TMDBServiceMock.movies);

        return ret;
    }
}

class TMDBServiceMockError extends TMDBService {
    public async list(
        params: ListMediasParams,
        includeMovie: String,
        includeSeries: String
    ) {
        throw new Error("error");
        return [] as TMDBMedia[];
    }
}

describe("Tv controller", () => {
    let mediaController: MediaController;

    beforeEach(() => {
        mediaController = new MediaController(new TMDBServiceMock());
    });

    test("Should return 200 with list of series", async () => {
        const mockRequest = {
            query: {
                includeSeries: "1",
                includeMovies: "0",
            },
        } as unknown as Request;

        const mockResponse = {} as unknown as Response;
        mockResponse.json = jest.fn(() => mockResponse);
        mockResponse.status = jest.fn(() => mockResponse);

        await mediaController.list_medias(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(TMDBServiceMock.series);
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

        await mediaController.list_medias(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(TMDBServiceMock.movies);
    });

    test("Should return 200 with list of all medias", async () => {
        const mockRequest = {
            query: {
                includeSeries: "1",
                includeMovies: "1",
            },
        } as unknown as Request;

        const mockResponse = {} as unknown as Response;
        mockResponse.json = jest.fn(() => mockResponse);
        mockResponse.status = jest.fn(() => mockResponse);

        await mediaController.list_medias(mockRequest, mockResponse);

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

        await mediaController.list_medias(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message:
                "You must provide least one of the following query parameters: includeMovies=1, includeSeries=1",
        });
    });

    test("Should return 400 with undefined request", async () => {
        const mockRequest = {
            query: undefined,
        } as unknown as Request;

        const mockResponse = {} as unknown as Response;
        mockResponse.json = jest.fn(() => mockResponse);
        mockResponse.status = jest.fn(() => mockResponse);

        await mediaController.list_medias(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Bad request: Query was undefined",
        });
    });

    test("Should return 400 with request with neither movies nor series", async () => {
        const mockRequest = {
            query: {
                includeSeries: "0",
                includeMovies: 0,
            },
        } as unknown as Request;

        const mockResponse = {} as unknown as Response;
        mockResponse.json = jest.fn(() => mockResponse);
        mockResponse.status = jest.fn(() => mockResponse);

        await mediaController.list_medias(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message:
                "You must provide least one of the following query parameters: includeMovies=1, includeSeries=1",
        });
    });

    test("Should return 500 with error in service", async () => {
        const mediaControllerError = new MediaController(
            new TMDBServiceMockError()
        );
        const mockRequest = {
            query: {
                includeSeries: "1",
            },
        } as unknown as Request;

        const mockResponse = {} as unknown as Response;
        mockResponse.send = jest.fn(() => mockResponse);
        mockResponse.status = jest.fn(() => mockResponse);

        await mediaControllerError.list_medias(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({ error: "error" });
    });
});
