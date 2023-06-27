import { RatingController } from "../../src/controllers/rating";

describe("Rating controller", () => {
    let ratingController: RatingController;
    let ratingService: any;

    beforeEach(() => {
        ratingService = {
            createRating: jest.fn(),
            updateRating: jest.fn(),
            deleteRating: jest.fn(),
            getUserRating: jest.fn(),
            listRatings: jest.fn(),
        };
        ratingController = new RatingController(ratingService);
    });

    describe("createRating", () => {
        test("Should return 400 if media id is empty", async () => {
            const req: any = {
                body: {
                    mediaId: "",
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.createRating(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Media ID necessary",
            });
        });

        test("Should return 400 if rating is -1", async () => {
            const req: any = {
                body: {
                    mediaId: 1,
                    rating: -1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.createRating(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message:
                    "Bad request: Rating value between 0 and 10 is necessary",
            });
        });

        test("Should return 400 if rating is 11", async () => {
            const req: any = {
                body: {
                    mediaId: 1,
                    rating: 11,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.createRating(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message:
                    "Bad request: Rating value between 0 and 10 is necessary",
            });
        });

        test("Should return 401 if user is not logged in", async () => {
            const req: any = {
                body: {
                    mediaId: 1,
                    rating: 5,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.createRating(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: "Unauthorized",
            });
        });

        test("Should return 201 if rating is created", async () => {
            const req: any = {
                body: {
                    mediaId: 1,
                    rating: 5,
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.createRating(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe("updateRating", () => {
        test("Should return 400 if rating id is empty", async () => {
            const req: any = {
                params: {},
                body: {},
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.updateRating(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Rating ID necessary",
            });
        });

        test("Should return 400 if rating id is invalid", async () => {
            const req: any = {
                params: {
                    ratingId: 0,
                },
                body: {},
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.updateRating(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Rating ID necessary",
            });
        });

        test("Should return 400 if rating is -1", async () => {
            const req: any = {
                params: {
                    ratingId: 1,
                },
                body: {
                    rating: -1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.updateRating(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message:
                    "Bad request: Rating value between 0 and 10 is necessary",
            });
        });

        test("Should return 400 if rating is 11", async () => {
            const req: any = {
                params: {
                    ratingId: 1,
                },
                body: {
                    rating: 11,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.updateRating(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message:
                    "Bad request: Rating value between 0 and 10 is necessary",
            });
        });

        test("Should return 401 if user is not logged in", async () => {
            const req: any = {
                params: {
                    ratingId: 1,
                },
                body: {
                    rating: 5,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.updateRating(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: "Unauthorized",
            });
        });

        test("Should return 204 if rating is updated", async () => {
            const req: any = {
                params: {
                    ratingId: 1,
                },
                body: {
                    rating: 5,
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.updateRating(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe("deleteRating", () => {
        test("Should return 400 if rating id is empty", async () => {
            const req: any = {
                params: {},
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.deleteRating(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Rating ID necessary",
            });
        });

        test("Should return 400 if rating id is invalid", async () => {
            const req: any = {
                params: {
                    ratingId: 0,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.deleteRating(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Rating ID necessary",
            });
        });

        test("Should return 401 if user is not logged in", async () => {
            const req: any = {
                params: {
                    ratingId: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.deleteRating(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: "Unauthorized",
            });
        });

        test("Should return 204 if rating is deleted", async () => {
            const req: any = {
                params: {
                    ratingId: 1,
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.deleteRating(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe("getUserRating", () => {
        test("Should return 400 if media id is empty", async () => {
            const req: any = {
                params: {
                    mediaId: "",
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.getUserRating(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Media ID necessary",
            });
        });

        test("Should return 401 if user is not logged in", async () => {
            const req: any = {
                params: {
                    mediaId: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.getUserRating(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: "Unauthorized",
            });
        });

        test("Should return 200 and user's rating", async () => {
            const req: any = {
                params: {
                    mediaId: 1,
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const ratingMock = {
                Id: 1,
                UserId: 1,
                MediaId: 1,
                Rating: 5,
            };

            ratingService.getUserRating.mockReturnValueOnce(ratingMock);
            await ratingController.getUserRating(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(ratingMock);
        });
    });

    describe("listRatings", () => {
        test("Should return 400 if media id is empty", async () => {
            const req: any = {
                params: {
                    mediaId: "",
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.listRatings(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Media ID necessary",
            });
        });

        test("Should return 200 with ratings", async () => {
            const req: any = {
                params: {
                    mediaId: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await ratingController.listRatings(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
        });
    });
});
