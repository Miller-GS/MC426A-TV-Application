import auth from "../../src/middleware/auth";
import env from "../../environment";
import jwt from "jsonwebtoken";
import { Response } from "express";

describe("auth middleware", () => {
    let res: Response;
    let next: jest.Mock;
    const validToken = jwt.sign({ id: 1 }, env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
    });

    test("should return 401 if no token is provided", () => {
        const req = {
            header: jest.fn().mockReturnValue(null),
        };
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            msg: "No token, authorization denied.",
        });
        expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 if token is not a Bearer token", () => {
        const req = {
            header: jest.fn().mockReturnValue("invalid_token"),
        };
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            msg: "No token, authorization denied.",
        });
        expect(next).not.toHaveBeenCalled();
    });

    test("should return 403 if token is invalid", () => {
        const req = {
            header: jest.fn().mockReturnValue("Bearer invalid_token"),
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };
        const next = jest.fn();
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ msg: "Token is not valid." });
        expect(next).not.toHaveBeenCalled();
    });

    test("should call next if token is valid", () => {
        const req = {
            header: jest.fn().mockReturnValue(`Bearer ${validToken}`),
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };
        const next = jest.fn();
        auth(req, res, next);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
