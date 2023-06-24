import { Request, Response } from "express";

import UsersController from "../../src/controllers/users";
import { InvalidRefreshTokenError } from "../../src/errors/InvalidRefreshTokenError";

describe("Users controller", () => {
    let controller: UsersController;
    let service: any;
    let res: Response;

    beforeEach(() => {
        service = {
            register: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            getNewAccessToken: jest.fn(),
        };

        controller = new UsersController(service);

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn(),
        } as unknown as Response;
    });

    describe("register", () => {
        test("register() should return 400 if name is not provided", async () => {
            const req = {
                body: {
                    email: "a@email.com",
                    password: "123456",
                },
            } as Request;

            await controller.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Name, email and password required.",
            });
        });

        test("register() should return 400 if email is not provided", async () => {
            const req = {
                body: {
                    name: "person",
                    password: "123456",
                },
            } as Request;

            await controller.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Name, email and password required.",
            });
        });

        test("register() should returno 400 if email is invalid", async () => {
            const req = {
                body: {
                    name: "person",
                    email: "invalid_email",
                    password: "123456",
                },
            } as Request;

            await controller.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid email.",
            });
        });

        test("register() should return 400 if password is not provided", async () => {
            const req = {
                body: {
                    name: "person",
                    email: "email@email.com",
                },
            } as Request;

            await controller.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Name, email and password required.",
            });
        });

        test("register() should return 201 if user is created successfully", async () => {
            const req = {
                body: {
                    name: "person",
                    email: "person@email.com",
                    password: "123456",
                },
            } as Request;

            await controller.register(req, res);

            expect(service.register).toHaveBeenCalledWith(
                "person",
                req.body.email,
                req.body.password
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "User created successfully",
            });
        });

        test("register() should return 500 if an error occurs", async () => {
            const req = {
                body: {
                    name: "person",
                    email: "person@email.com",
                    password: "123456",
                },
            } as Request;

            service.register = jest
                .fn()
                .mockRejectedValue(new Error("Error message"));

            await controller.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error message" });
        });
    });

    describe("login", () => {
        test("login() should return 400 if email is not provided", async () => {
            const req = {
                body: {
                    password: "existing_password",
                },
            } as Request;

            await controller.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Email and password required.",
            });
        });

        test("login() should return 400 if password is not provided", async () => {
            const req = {
                body: {
                    email: "existing_email@email.com",
                },
            } as Request;

            await controller.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Email and password required.",
            });
        });

        test("login() should return 200 if login is successfull", async () => {
            const req = {
                body: {
                    email: "existing_email@email.com",
                    password: "existing_password",
                },
            } as Request;

            service.login.mockResolvedValueOnce({
                accessToken: "accessToken",
                refreshToken: "refreshToken",
            });

            await controller.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("login() should return 500 if an error occurs", async () => {
            const req = {
                body: {
                    email: "existing_email@email.com",
                    password: "existing_password",
                },
            } as Request;

            service.login = jest
                .fn()
                .mockRejectedValue(new Error("Error message"));

            await controller.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error message" });
        });
    });

    describe("handleRefreshToken", () => {
        test("handleRefreshToken() should return 401 if no token is provided", async () => {
            const req = {} as Request;

            await controller.handleRefreshToken(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: "No refresh token provided.",
            });
        });

        test("handleRefreshToken() should return 403 if token is invalid", async () => {
            const req = {
                cookies: {
                    refreshToken: "invalid_token",
                },
            } as Request;

            service.getNewAccessToken.mockRejectedValueOnce(new InvalidRefreshTokenError());
            await controller.handleRefreshToken(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid refresh token",
            });
        });

        test("handleRefreshToken() should return 200 if token is valid", async () => {
            const refreshToken = "test token";
            const accessToken = "access token";

            const req = {
                cookies: {
                    refreshToken: refreshToken,
                },
            } as Request;

            service.getNewAccessToken.mockResolvedValueOnce(accessToken);
            await controller.handleRefreshToken(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                accessToken: accessToken,
            });
        });
    });

    describe("logout", () => {
        test("logout() should return 204 if no token is provided", async () => {
            const req = {} as Request;

            await controller.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith({
                message: "No refresh token provided.",
            });
        });

        test("logout() should return 204 and clear cookie if token is invalid", async () => {
            const req = {
                cookies: {
                    refreshToken: "invalid_token",
                },
            } as Request;

            await controller.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith({
                message: "Logged out successfully.",
            });
            expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
                httpOnly: true,
            });
        });

        test("logout() should return 204, clear cookie and update database if token is valid", async () => {
            const refreshToken = "test token";

            const req = {
                cookies: {
                    refreshToken: refreshToken,
                },
            } as Request;

            await controller.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith({
                message: "Logged out successfully.",
            });
            expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
                httpOnly: true,
            });
            expect(service.logout).toHaveBeenCalledWith(refreshToken);
        });
    });
});
