import request from "supertest";
import app from "../../app";

describe("Tv module", () => {
    test("list service", async () => {
        const response = await request(app).get("/users/login");
        expect(response.body).toEqual("Hello00o, World!");
    });
});
