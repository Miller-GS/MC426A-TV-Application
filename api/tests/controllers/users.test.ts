import { Request, Response } from "express";

import UsersController from "../../src/controllers/users";
import { DataSource } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../environment";

describe("Users controller", () => {
    let controller: UsersController;
    let res: Response;
    let userRepositoryMock;
    const validToken = jwt.sign({ id: 1 }, env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1h",
    });

    beforeEach(() => {
        userRepositoryMock = {
            findOne: jest.fn((options) => {
                if (
                    options.where.Email === "existing_email@email.com" ||
                    options.where.RefreshToken === validToken
                ) {
                    return {
                        Id: 1,
                        Name: "existing_name",
                        Email: "existing_email@email.com",
                        Password: bcrypt.hashSync("existing_password", 10),
                        RefreshToken: validToken,
                    };
                }
                return null;
            }),
            save: jest.fn(),
            update: jest.fn(),
        };
        let appDataSourceMock = {
            getRepository: jest.fn().mockReturnValue(userRepositoryMock),
        } as unknown as DataSource;
        controller = new UsersController(appDataSourceMock);
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn(),
        } as unknown as Response;
    });

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
            msg: "Name, email and password required.",
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
            msg: "Name, email and password required.",
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
            msg: "Invalid email.",
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
            msg: "Name, email and password required.",
        });
    });

    test("register() should return 409 if user already exists", async () => {
        const req = {
            body: {
                name: "person",
                email: "existing_email@email.com",
                password: "123456",
            },
        } as Request;

        await controller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ msg: "User already exists" });
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

        expect(userRepositoryMock.save).toHaveBeenCalledWith({
            Name: "person",
            Email: req.body.email,
            Password: expect.any(String),
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            msg: "User created successfully",
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

        userRepositoryMock.save = jest
            .fn()
            .mockRejectedValue(new Error("Error message"));

        await controller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Error message" });
    });

    test("login() should return 400 if email is not provided", async () => {
        const req = {
            body: {
                password: "existing_password",
            },
        } as Request;

        await controller.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            msg: "Email and password required.",
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
            msg: "Email and password required.",
        });
    });

    test("login() should return 401 if user does not exists", async () => {
        const req = {
            body: {
                email: "email@email.com",
                password: "123456",
            },
        } as Request;

        await controller.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: "Invalid access." });
    });

    test("login() should return 401 if password is wrong", async () => {
        const req = {
            body: {
                email: "existing_email@email.com",
                password: "123456",
            },
        } as Request;

        await controller.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: "Invalid access." });
    });

    test("login() should return 200 if login is successfull", async () => {
        const req = {
            body: {
                email: "existing_email@email.com",
                password: "existing_password",
            },
        } as Request;

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

        userRepositoryMock.save = jest
            .fn()
            .mockRejectedValue(new Error("Error message"));

        await controller.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Error message" });
    });

    test("handleRefreshToken() should return 401 if no token is provided", async () => {
        const req = {} as Request;

        await controller.handleRefreshToken(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            msg: "No refresh token provided.",
        });
    });

    test("handleRefreshToken() should return 403 if token is invalid", async () => {
        const req = {
            cookies: {
                refreshToken: "invalid_token",
            },
        } as Request;

        await controller.handleRefreshToken(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            msg: "Invalid refresh token.",
        });
    });

    test("handleRefreshToken() should return 200 if token is valid", async () => {
        const req = {
            cookies: {
                refreshToken: validToken,
            },
        } as Request;

        await controller.handleRefreshToken(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            accessToken: expect.any(String),
        });
    });

    test("logout() should return 204 if no token is provided", async () => {
        const req = {} as Request;

        await controller.logout(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({
            msg: "No refresh token provided.",
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
            msg: "Logged out successfully.",
        });
        expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    });

    test("logout() should return 204, clear cookie and update database if token is valid", async () => {
        const req = {
            cookies: {
                refreshToken: validToken,
            },
        } as Request;

        await controller.logout(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({
            msg: "Logged out successfully.",
        });
        expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        expect(userRepositoryMock.update).toHaveBeenCalledWith(1, {
            RefreshToken: null,
        });
    });
});
