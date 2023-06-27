import { Request, Response } from "express";
import { FriendshipController } from "../../src/controllers/friendship";
import { FriendshipNotFoundError } from "../../src/errors/FriendshipNotFoundError";

describe("Friendship controller", () => {
    let friendshipController: FriendshipController;
    let service: any;
    let res: Response;

    beforeEach(() => {
        service = {
            acceptFriendship: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            getNewAccessToken: jest.fn(),
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        friendshipController = new FriendshipController(service);
    });
    describe("Accept Friendship", () => {
        test("Should return 200 and approve a friendship", async () => {
            const req = {
                params: {
                    userId: "2",
                },
                body: {
                    accepted: "true",
                },
                user: {
                    id: "1"
                }
        } as unknown as Request;

            await friendshipController.acceptFriend(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();
        });

        test("Should return 404 when the friendship don't exist", async () => {
            const req = {
                params: {
                    userId: "2",
                },
                body: {
                    accepted: "true",
                },
                user: {
                    id: "1"
                }
        } as unknown as Request;

            service.acceptFriendship = jest.fn().mockRejectedValueOnce(new FriendshipNotFoundError());

            await friendshipController.acceptFriend(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Friendship not found"
            });
        });
    });

});
