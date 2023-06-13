import { Request, Response } from "express";

import { TvController } from "../../src/controllers/tv";
import TMDBService from "../../src/services/tmdbService";
import { ShowParser, Show } from "../../src/models/show";
import { ListMediasParams } from "../../src/models/listMediasParams";

class TMDBServiceMock extends TMDBService {
    static series = [
        ShowParser.parseTv({ id: 1 }),
        ShowParser.parseTv({ id: 2 }),
    ];
    static movies = [
        ShowParser.parseMovie({ id: 3 }),
        ShowParser.parseMovie({ id: 4 }),
    ];

    static shows = TMDBServiceMock.series.concat(TMDBServiceMock.movies);

    public async list(
        params: ListMediasParams,
        includeMovie: String,
        includeSeries: String
    ) {
        let ret: Show[] = [];

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
        return [] as Show[];
    }
}

describe("Tv controller", () => {
    let tvController: TvController;

    beforeEach(() => {
        tvController = new TvController(new TMDBServiceMock());
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

        await tvController.list_shows(mockRequest, mockResponse);

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

        await tvController.list_shows(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(TMDBServiceMock.movies);
    });

    test("Should return 200 with list of all shows", async () => {
        const mockRequest = {
            query: {
                includeSeries: "1",
                includeMovies: "1",
            },
        } as unknown as Request;

        const mockResponse = {} as unknown as Response;
        mockResponse.json = jest.fn(() => mockResponse);
        mockResponse.status = jest.fn(() => mockResponse);

        await tvController.list_shows(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(TMDBServiceMock.shows);
    });

    test("Should return 400 with empty request", async () => {
        const mockRequest = {
            query: {},
        } as unknown as Request;

        const mockResponse = {} as unknown as Response;
        mockResponse.json = jest.fn(() => mockResponse);
        mockResponse.status = jest.fn(() => mockResponse);

        await tvController.list_shows(mockRequest, mockResponse);

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

        await tvController.list_shows(mockRequest, mockResponse);

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

        await tvController.list_shows(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message:
                "You must provide least one of the following query parameters: includeMovies=1, includeSeries=1",
        });
    });

    test("Show return 500 with error in service", async () => {
        const tvControllerError = new TvController(new TMDBServiceMockError());
        const mockRequest = {
            query: {
                includeSeries: "1",
            },
        } as unknown as Request;

        const mockResponse = {} as unknown as Response;
        mockResponse.send = jest.fn(() => mockResponse);
        mockResponse.status = jest.fn(() => mockResponse);

        await tvControllerError.list_shows(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({ error: "error" });
    });
});
