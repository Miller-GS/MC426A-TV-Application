import { WatchListController } from "../../src/controllers/watchList";
import { EmptyWatchListDescriptionError } from "../../src/errors/EmptyWatchListDescriptionError";
import { EmptyWatchListTitleError } from "../../src/errors/EmptyWatchListTitleError";
import { UserNotExistsError } from "../../src/errors/UserNotExistsError";
import { WatchListNotFoundError } from "../../src/errors/WatchListNotFoundError";
import { WatchListNotOwnedError } from "../../src/errors/WatchListNotOwnedError";

describe("WatchListController", () => {
    let watchListController: WatchListController;
    let watchListService: any;
    let defaultResponseMock: any;

    beforeEach(() => {
        watchListService = {
            createWatchList: jest.fn(),
            addWatchListItems: jest.fn(),
            getWatchListItems: jest.fn(),
        };
        watchListController = new WatchListController(watchListService);
        defaultResponseMock = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    describe("createWatchList", () => {
        test("Should return 400 if invalid privacy type", async () => {
            const req: any = {
                body: {
                    title: "title",
                    description: "description",
                    privacyType: "invalid",
                },
            };
            await watchListController.createWatchList(req, defaultResponseMock);
            expect(defaultResponseMock.status).toHaveBeenCalledWith(400);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message:
                    'Invalid privacy type. Valid values are "Public", "Private" or "FriendsOnly"',
            });
        });

        test("Should return 401 if user not logged in", async () => {
            const req: any = {
                body: {
                    title: "title",
                    description: "description",
                    privacyType: "Public",
                },
            };
            await watchListController.createWatchList(req, defaultResponseMock);
            expect(defaultResponseMock.status).toHaveBeenCalledWith(401);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message: "Unauthorized",
            });
        });

        test("Should return 400 if empty title error", async () => {
            const req: any = {
                body: {
                    title: "",
                    description: "description",
                    privacyType: "Public",
                },
                user: {
                    id: 1,
                },
            };
            watchListService.createWatchList.mockRejectedValueOnce(
                new EmptyWatchListTitleError()
            );

            await watchListController.createWatchList(req, defaultResponseMock);

            expect(defaultResponseMock.status).toHaveBeenCalledWith(400);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message: "Watch list should have a title",
            });
        });

        test("Should return 400 if empty description error", async () => {
            const req: any = {
                body: {
                    title: "title",
                    description: "",
                    privacyType: "Public",
                },
                user: {
                    id: 1,
                },
            };
            watchListService.createWatchList.mockRejectedValueOnce(
                new EmptyWatchListDescriptionError()
            );

            await watchListController.createWatchList(req, defaultResponseMock);

            expect(defaultResponseMock.status).toHaveBeenCalledWith(400);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message: "Watch list should have a description",
            });
        });

        test("Should return 201 if watch list created", async () => {
            const req: any = {
                body: {
                    title: "title",
                    description: "description",
                    privacyType: "Public",
                },
                user: {
                    id: 1,
                },
            };
            const watchListMock = {
                id: 1,
                title: "title",
                description: "description",
                privacyType: "Public",
            };
            watchListService.createWatchList.mockResolvedValueOnce(
                watchListMock
            );

            await watchListController.createWatchList(req, defaultResponseMock);

            expect(defaultResponseMock.status).toHaveBeenCalledWith(201);
            expect(defaultResponseMock.json).toHaveBeenCalledWith(
                watchListMock
            );
        });
    });

    describe("addWatchListItems", () => {
        test("Should return 401 if user not logged in", async () => {
            const req: any = {
                body: {
                    watchListId: 1,
                    mediaId: 1,
                },
            };
            await watchListController.addWatchListItems(
                req,
                defaultResponseMock
            );
            expect(defaultResponseMock.status).toHaveBeenCalledWith(401);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message: "Unauthorized",
            });
        });

        test("Should return 400 if watch list id not provided", async () => {
            const req: any = {
                body: {
                    mediaIds: [1],
                },
                user: {
                    id: 1,
                },
            };
            await watchListController.addWatchListItems(
                req,
                defaultResponseMock
            );
            expect(defaultResponseMock.status).toHaveBeenCalledWith(400);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message: "Watch list id not provided",
            });
        });

        test("Should return 400 if media ids not provided", async () => {
            const req: any = {
                body: {
                    watchListId: 1,
                },
                user: {
                    id: 1,
                },
            };
            await watchListController.addWatchListItems(
                req,
                defaultResponseMock
            );
            expect(defaultResponseMock.status).toHaveBeenCalledWith(400);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message: "Media ids array not provided in body",
            });
        });

        test("Should return 400 if media ids not an array", async () => {
            const req: any = {
                body: {
                    watchListId: 1,
                    mediaIds: 1,
                },
                user: {
                    id: 1,
                },
            };
            await watchListController.addWatchListItems(
                req,
                defaultResponseMock
            );
            expect(defaultResponseMock.status).toHaveBeenCalledWith(400);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message: "Media ids array not provided in body",
            });
        });

        test("Should return 403 if user not watch list owner", async () => {
            const req: any = {
                body: {
                    watchListId: 1,
                    mediaIds: [1],
                },
                user: {
                    id: 1,
                },
            };
            watchListService.addWatchListItems.mockRejectedValueOnce(
                new WatchListNotOwnedError()
            );

            await watchListController.addWatchListItems(
                req,
                defaultResponseMock
            );

            expect(defaultResponseMock.status).toHaveBeenCalledWith(403);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message: "Watch list not owned by logged in user",
            });
        });

        test("Should add watch list items", async () => {
            const req: any = {
                body: {
                    watchListId: 1,
                    mediaIds: [1],
                },
                user: {
                    id: 1,
                },
            };
            const watchListItemsMock = [
                {
                    id: 1,
                    watchListId: 1,
                    mediaId: 1,
                },
            ];
            watchListService.addWatchListItems.mockResolvedValueOnce(
                watchListItemsMock
            );

            await watchListController.addWatchListItems(
                req,
                defaultResponseMock
            );

            expect(defaultResponseMock.status).toHaveBeenCalledWith(201);
            expect(defaultResponseMock.json).toHaveBeenCalledWith(
                watchListItemsMock
            );
        });
    });

    describe("getWatchList", () => {
        test("Should return 400 if watch list id not provided", async () => {
            const req: any = { params: {} };
            await watchListController.getWatchList(req, defaultResponseMock);
            expect(defaultResponseMock.status).toHaveBeenCalledWith(400);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message: "Watch list id not provided",
            });
        });

        test("Should return 401 if logged in user does not exist", async () => {
            const req: any = {
                params: {
                    id: 1,
                },
            };
            watchListService.getWatchListItems.mockRejectedValueOnce(
                new UserNotExistsError()
            );
            await watchListController.getWatchList(req, defaultResponseMock);
            expect(defaultResponseMock.status).toHaveBeenCalledWith(401);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message: "User does not exist",
            });
        });

        test("Should return 404 if watch list does not exist", async () => {
            const req: any = {
                params: {
                    id: 1,
                },
                user: {
                    id: 1,
                },
            };
            watchListService.getWatchListItems.mockRejectedValueOnce(
                new WatchListNotFoundError()
            );
            await watchListController.getWatchList(req, defaultResponseMock);
            expect(defaultResponseMock.status).toHaveBeenCalledWith(404);
            expect(defaultResponseMock.json).toHaveBeenCalledWith({
                message: "Watch list not found",
            });
        });

        test("Should return watch given user id and watch list id", async () => {
            const req: any = {
                params: {
                    id: 1,
                },
                user: {
                    id: 1,
                },
            };
            const watchListMock = {
                id: 1,
                title: "title",
                description: "description",
                privacyType: "Public",
            };
            watchListService.getWatchListItems.mockResolvedValueOnce(
                watchListMock
            );
            await watchListController.getWatchList(req, defaultResponseMock);
            expect(defaultResponseMock.status).toHaveBeenCalledWith(200);
            expect(defaultResponseMock.json).toHaveBeenCalledWith(
                watchListMock
            );
        });

        test("Should return watch list not given user id", async () => {
            const req: any = {
                params: {
                    id: 1,
                },
            };
            const watchListMock = {
                id: 1,
                title: "title",
                description: "description",
                privacyType: "Public",
            };
            watchListService.getWatchListItems.mockResolvedValueOnce(
                watchListMock
            );
            await watchListController.getWatchList(req, defaultResponseMock);
            expect(defaultResponseMock.status).toHaveBeenCalledWith(200);
            expect(defaultResponseMock.json).toHaveBeenCalledWith(
                watchListMock
            );
        });
    });
});
