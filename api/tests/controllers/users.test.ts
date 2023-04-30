import { Request, Response } from "express";

import UsersController from "../../src/controllers/users";
import { DataSource } from "typeorm";

describe("Users controller", () => {
    let controller: UsersController;
    let res: Response;
    let userRepositoryMock;

    beforeEach(() => {
        userRepositoryMock = {
            findOne: jest.fn((options) => {
                if (options.where.Email === "existing_email@email.com") {
                    return {"id": 1, "name": "existing_name", "email": "existing_email@email.com", "password": "existing_password"}
                }
                return null;
            }),
            save: jest.fn(),
        };
        let appDataSourceMock = {
            getRepository: jest.fn().mockReturnValue(userRepositoryMock),
        } as unknown as DataSource;
        controller = new UsersController(appDataSourceMock);
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
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
        expect(res.json).toHaveBeenCalledWith({ msg: "Please enter all fields" });
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
        expect(res.json).toHaveBeenCalledWith({ msg: "Please enter all fields" });
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
        expect(res.json).toHaveBeenCalledWith({ msg: "Please enter all fields" });
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

        expect(userRepositoryMock.save).toHaveBeenCalledWith({ Name: "person", Email: req.body.email, Password: expect.any(String) });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ msg: "User created successfully" });
    });

    test("register() should return 500 if an error occurs", async () => {
        const req = {
            body: {
                name: "person",
                email: "person@email.com",
                password: "123456",
            },
        } as Request;

        userRepositoryMock.save = jest.fn().mockRejectedValue(new Error("Error message"));

        await controller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Error message" });
    });
});
