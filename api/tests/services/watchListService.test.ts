import { WatchListPrivacyType } from "../../src/entity/watchList.entity";
import { EmptyWatchListDescriptionError } from "../../src/errors/EmptyWatchListDescriptionError";
import { EmptyWatchListTitleError } from "../../src/errors/EmptyWatchListTitleError";
import { MediaNotFoundError } from "../../src/errors/MediaNotFoundError";
import { UserNotExistsError } from "../../src/errors/UserNotExistsError";
import { WatchListNotFoundError } from "../../src/errors/WatchListNotFoundError";
import { WatchListNotOwnedError } from "../../src/errors/WatchListNotOwnedError";
import { WatchListParser } from "../../src/models/watchList";
import WatchListService from "../../src/services/watchListService";


const makeWatchListEntityMock = (entity = {} as any) => {
    return {
        Id: entity.Id || 1,
        Owner: {
            Id: entity.UserId || 1,
        },
        Title: entity.Title || "WatchList title",
        Description: entity.Description || "WatchList description",
        PrivacyType: entity.PrivacyType || WatchListPrivacyType.PUBLIC,
        CreatedAt: entity.CreatedAt || new Date(),
        UpdatedAt: entity.UpdatedAt || new Date(),
        DeletedAt: entity.DeletedAt || null,
    };
};

describe("WatchList Service", () => {
    let watchListService: WatchListService;
    let watchListRepositoryMock: any;
    let watchListItemRepositoryMock: any;
    let userRepositoryMock: any;
    let mediaRepositoryMock: any;
    let tmdbRepositoryMock: any;

    beforeEach(() => {
        watchListRepositoryMock = {
            save: jest.fn(),
            findOne: jest.fn(),
        };

        watchListItemRepositoryMock = {
            exist: jest.fn(),
            save: jest.fn(),
        };

        userRepositoryMock = {
            exist: jest.fn(),
        };

        mediaRepositoryMock = {
            exist: jest.fn(),
        };

        tmdbRepositoryMock = {
            getMedia: jest.fn(),
        };

        watchListService = new WatchListService(
            watchListRepositoryMock,
            watchListItemRepositoryMock,
            userRepositoryMock,
            mediaRepositoryMock,
            tmdbRepositoryMock
        );

        WatchListParser.parseWatchList = jest.fn().mockImplementation((watchList) => {
            watchList.parsed = true;
            return watchList
        });
    });

    describe("Create WatchList", () => {
        test("Should throw EmptyWatchListTitleError if title is empty", async () => {
            await expect(
                watchListService.createWatchList(
                    1,
                    "",
                    "description",
                    WatchListPrivacyType.PUBLIC
                )
            ).rejects.toThrow(EmptyWatchListTitleError);
        });

        test("Should throw EmptyWatchListDescriptionError if description is empty", async () => {
            await expect(
                watchListService.createWatchList(
                    1,
                    "title",
                    "",
                    WatchListPrivacyType.PUBLIC
                )
            ).rejects.toThrow(EmptyWatchListDescriptionError);
        });

        test("Should throw UserNotExistsError if user does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(
                watchListService.createWatchList(
                    1,
                    "title",
                    "description",
                    WatchListPrivacyType.PUBLIC
                )
            ).rejects.toThrow(UserNotExistsError);
        });

        test("Should create and return watchList if user exists and title and description are not empty", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            const watchListEntityMock = makeWatchListEntityMock();
            watchListRepositoryMock.save.mockReturnValueOnce(
                watchListEntityMock
            );

            const response = await watchListService.createWatchList(
                1,
                "WatchList title",
                "WatchList description",
                WatchListPrivacyType.PUBLIC
            );

            expect(response).toEqual(watchListEntityMock);
            expect(watchListRepositoryMock.save).toHaveBeenCalledTimes(1);
            expect(watchListRepositoryMock.save).toHaveBeenCalledWith({
                Owner: {
                    Id: 1,
                },
                Title: "WatchList title",
                Description: "WatchList description",
                PrivacyType: WatchListPrivacyType.PUBLIC,
            });
        });
    });

    describe("Add watch list items", () => {
        test("Should throw UserNotExistsError if user does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(
                watchListService.addWatchListItems(1, 1, [1, 2, 3])
            ).rejects.toThrow(UserNotExistsError);
        });

        test("Should throw WatchListNotFoundError if watch list does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce(undefined);

            await expect(
                watchListService.addWatchListItems(1, 1, [1, 2, 3])
            ).rejects.toThrow(WatchListNotFoundError);
        });

        test("Should throw WatchListNotOwnedError if watch list does not belong to user", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce({
                Id: 1,
                Owner: {
                    Id: 2,
                },
            });

            await expect(
                watchListService.addWatchListItems(1, 1, [1, 2, 3])
            ).rejects.toThrow(WatchListNotOwnedError);
        });

        test("Should throw MediaNotFoundError if media does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce({
                Id: 1,
                Owner: {
                    Id: 1,
                },
            });
            mediaRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(
                watchListService.addWatchListItems(1, 1, [1, 2, 3])
            ).rejects.toThrow(MediaNotFoundError);
        });

        test("Should do nothing if media already exists in watch list", async () => {
            userRepositoryMock.exist.mockReturnValue(true);
            watchListRepositoryMock.findOne.mockReturnValue({
                Id: 1,
                Owner: {
                    Id: 1,
                },
            });
            mediaRepositoryMock.exist.mockReturnValue(true);
            watchListItemRepositoryMock.exist.mockReturnValue(true);

            await watchListService.addWatchListItems(1, 1, [1, 2, 3]);

            expect(watchListItemRepositoryMock.save).toHaveBeenCalledTimes(0);
        });

        test("Should add media to watch list if media exists and watch list exists and belongs to user", async () => {
            userRepositoryMock.exist.mockReturnValue(true);
            watchListRepositoryMock.findOne.mockReturnValue({
                Id: 1,
                Owner: {
                    Id: 1,
                },
            });
            mediaRepositoryMock.exist.mockReturnValue(true);
            watchListItemRepositoryMock.exist.mockReturnValue(false);

            await watchListService.addWatchListItems(1, 1, [1, 2, 3]);

            expect(watchListItemRepositoryMock.save).toHaveBeenCalledTimes(3);
            expect(watchListItemRepositoryMock.save).toHaveBeenCalledWith({
                WatchList: {
                    Id: 1,
                },
                Media: {
                    Id: 1,
                },
            });
            expect(watchListItemRepositoryMock.save).toHaveBeenCalledWith({
                WatchList: {
                    Id: 1,
                },
                Media: {
                    Id: 2,
                },
            });
            expect(watchListItemRepositoryMock.save).toHaveBeenCalledWith({
                WatchList: {
                    Id: 1,
                },
                Media: {
                    Id: 3,
                },
            });
        });
    });

    describe("getWatchListItems", () => {
        test("Should throw UserNotExistsError if user is passed but does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(
                watchListService.getWatchListItems(1, 1)
            ).rejects.toThrow(UserNotExistsError);
        });

        test("Should throw WatchListNotFoundError if watch list does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce(undefined);

            await expect(
                watchListService.getWatchListItems(1, 1)
            ).rejects.toThrow(WatchListNotFoundError);
        });

        test("Should throw WatchListNotFoundError if watch list is private and does not belong to user", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce({
                Id: 1,
                Owner: {
                    Id: 2,
                },
                PrivacyType: WatchListPrivacyType.PRIVATE,
            });

            await expect(
                watchListService.getWatchListItems(1, 1)
            ).rejects.toThrow(WatchListNotFoundError);
        });

        test("Should return watch list items if watch list is public", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            const watchListEntityMock = makeWatchListEntityMock({privacyType: WatchListPrivacyType.PUBLIC}) as any;
            watchListRepositoryMock.findOne.mockReturnValueOnce(watchListEntityMock);

            const response = await watchListService.getWatchListItems(1, 1);

            watchListEntityMock.parsed = true;
            expect(response).toEqual(watchListEntityMock);
        });
    });
});
