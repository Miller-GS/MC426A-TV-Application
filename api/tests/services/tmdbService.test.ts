// The idea of this test module is to check whether the correct parameters arrive at the get method
// in the TMDBService object.
// The point is to assume the axios request and the API are working and only test if we are using them correctly.

import request from "supertest";
import axios from "axios";

import app from "../../app";
import TMDBService from "../../src/services/tmdbService";
import { ShowParser } from "../../src/models/show";

interface Show {
    path: string;
    params: Object;
    popularity: number;
}

ShowParser.parseTv = (obj) => obj;
ShowParser.parseMovie = (obj) => obj;

class TMDBServiceTest extends TMDBService {
    protected async get(path: String, params: Object) {
        return [{ path: path, params: params, popularity: 0 } as Show];
    }
}

describe("TMDB Service", () => {
    let tmdbService: TMDBServiceTest;

    beforeEach(() => {
        tmdbService = new TMDBServiceTest();
    });

    test("Should search movie by name", async () => {
        const response = await tmdbService.list("X", "", "", "1", "", "");
        const expected = {
            path: "/search/movie",
            params: {
                query: "X",
                year: "",
            },
            popularity: 0,
        };

        expect(response).toEqual([expected]);
    });
});
