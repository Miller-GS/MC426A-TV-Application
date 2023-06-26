import { WatchListController } from "../../src/controllers/watchList";
import { EmptyWatchListDescriptionError } from "../../src/errors/EmptyWatchListDescriptionError";
import { EmptyWatchListTitleError } from "../../src/errors/EmptyWatchListTitleError";

describe("WatchListController", () => {
    let watchListController: WatchListController;
    let watchListService: any;
    let defaultResponseMock: any;

    beforeEach(() => {
        watchListService = {
            createWatchList: jest.fn(),
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
                message: "Invalid privacy type. Valid values are \"Public\", \"Private\" or \"FriendsOnly\"",
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
            watchListService.createWatchList.mockRejectedValueOnce(new EmptyWatchListTitleError());

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
            watchListService.createWatchList.mockRejectedValueOnce(new EmptyWatchListDescriptionError());

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
            watchListService.createWatchList.mockResolvedValueOnce(watchListMock);

            await watchListController.createWatchList(req, defaultResponseMock);

            expect(defaultResponseMock.status).toHaveBeenCalledWith(201);
            expect(defaultResponseMock.json).toHaveBeenCalledWith(watchListMock);
        });
    });
});