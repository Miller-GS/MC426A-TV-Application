import { Request, Response } from "express";

import { TvController } from "../../src/controllers/tv";
import TMDBService from "../../src/services/tmdbService";
import { ShowParser, Show } from "../../src/models/show";

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
        name: String,
        genres: String,
        year: String,
        isMovie: String,
        isSeries: String,
        page: String
    ) {
        let ret: Show[] = [];

        if (isSeries === "1") ret = ret.concat(TMDBServiceMock.series);
        if (isMovie === "1") ret = ret.concat(TMDBServiceMock.movies);

        return ret;
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
                isSeries: "1",
                isMovie: "0",
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
                isMovie: "1",
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
                isSeries: "1",
                isMovie: "1",
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
                "You must provide least one of the following query parameters: isMovie=1, isSeries=1",
        });
    });

    test("Should return 400 with request with neither movies nor series", async () => {
        const mockRequest = {
            query: {
                isSeries: "0",
                isMovie: 0,
            },
        } as unknown as Request;

        const mockResponse = {} as unknown as Response;
        mockResponse.json = jest.fn(() => mockResponse);
        mockResponse.status = jest.fn(() => mockResponse);

        await tvController.list_shows(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message:
                "You must provide least one of the following query parameters: isMovie=1, isSeries=1",
        });
    });
});
