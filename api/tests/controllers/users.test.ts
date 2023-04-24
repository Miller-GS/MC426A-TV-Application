import request from "supertest"
import app from "../../app"

describe("Users module", () => {
  test('login controller', async () => {
    const response = await request(app).get("/users/login");
    expect(response.body).toEqual("Hello00o, World!");
  });
});