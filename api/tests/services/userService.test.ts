import { Request, Response } from "express";

import { DataSource } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../environment";
import UserService from "../../src/services/userService";
import { UserAlreadyExistsError } from "../../src/errors/UserAlreadyExistsError";
import { UserNotExistsError } from "../../src/errors/UserNotExistsError";
import { InvalidAccessError } from "../../src/errors/InvalidAccessError";
import { InvalidRefreshTokenError } from "../../src/errors/InvalidRefreshTokenError";

describe("Users controller", () => {
    let service: UserService;
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

        service = new UserService(userRepositoryMock);
    });

    describe("register", () => {
        test("register() should return UserAlreadyExistsError if user already exists", async () => {
            const name = "person";
            const email = "existing_email@email.com";
            const password = "123456";

            await expect(
                service.register(name, email, password)
            ).rejects.toThrow(UserAlreadyExistsError);
        });

        test("register() should create user successfully", async () => {
            const name = "person";
            const email = "person@email.com";
            const password = "123456";

            await service.register(name, email, password);

            expect(userRepositoryMock.save).toHaveBeenCalledWith({
                Name: "person",
                Email: email,
                Password: expect.any(String),
            });
        });
    });

    describe("login", () => {
        test("login() should throw UserNotExistsError if user does not exists", async () => {
            const email = "email@email.com";
            const password = "123456";

            await expect(service.login(email, password)).rejects.toThrow(
                UserNotExistsError
            );
        });

        test("login() should throw InvalidAccessError if password is wrong", async () => {
            const email = "existing_email@email.com";
            const password = "123456";

            await expect(service.login(email, password)).rejects.toThrow(
                InvalidAccessError
            );
        });

        test("login() should login successfully", async () => {
            const email = "existing_email@email.com";
            const password = "existing_password";

            const tokens = await service.login(email, password);

            expect(tokens).toEqual({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            });
        });
    });

    describe("getNewAccessToken", () => {
        test("getNewAccessToken() should throw InvalidRefreshTokenError if token is invalid", async () => {
            const refreshToken = "invalid_token";

            await expect(
                service.getNewAccessToken(refreshToken)
            ).rejects.toThrow(InvalidRefreshTokenError);
        });

        test("getNewAccessToken() should update access token if refresh token is valid", async () => {
            const accessToken = await service.getNewAccessToken(validToken);
            expect(accessToken).toEqual(expect.any(String));
        });
    });

    describe("logout", () => {
        test("logout() should update database if token is valid", async () => {
            await service.logout(validToken);

            expect(userRepositoryMock.update).toHaveBeenCalledWith(1, {
                RefreshToken: null,
            });
        });
    });
});
