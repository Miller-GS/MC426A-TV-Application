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
    let friendshipRepositoryMock: any;

    beforeEach(() => {
        watchListRepositoryMock = {
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
        };

        watchListItemRepositoryMock = {
            exist: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
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

        friendshipRepositoryMock = {
            exist: jest.fn(),
        };

        watchListService = new WatchListService(
            watchListRepositoryMock,
            watchListItemRepositoryMock,
            userRepositoryMock,
            mediaRepositoryMock,
            tmdbRepositoryMock,
            friendshipRepositoryMock
        );

        WatchListParser.parseWatchList = jest
            .fn()
            .mockImplementation((watchList) => {
                watchList.parsed = true;
                return watchList;
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

        test("Should throw WatchListNotFoundError if watch list is friends only and owner is not user's friend", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            friendshipRepositoryMock.exist.mockReturnValueOnce(false);
            watchListRepositoryMock.findOne.mockReturnValueOnce({
                Id: 1,
                Owner: {
                    Id: 2,
                },
                PrivacyType: WatchListPrivacyType.FRIENDS_ONLY,
            });

            await expect(
                watchListService.getWatchListItems(1, 1)
            ).rejects.toThrow(WatchListNotFoundError);
        });

        test("Should return watch list items if watch list is friends only and owner is user's friend", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            friendshipRepositoryMock.exist.mockReturnValueOnce(true);
            const watchListEntityMock = makeWatchListEntityMock({
                privacyType: WatchListPrivacyType.FRIENDS_ONLY,
            }) as any;
            watchListRepositoryMock.findOne.mockReturnValueOnce(
                watchListEntityMock
            );

            const response = await watchListService.getWatchListItems(1, 1);

            watchListEntityMock.parsed = true;
            expect(response).toEqual(watchListEntityMock);
        });

        test("Should return watch list items if watch list is public", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            const watchListEntityMock = makeWatchListEntityMock({
                privacyType: WatchListPrivacyType.PUBLIC,
            }) as any;
            watchListRepositoryMock.findOne.mockReturnValueOnce(
                watchListEntityMock
            );

            const response = await watchListService.getWatchListItems(1, 1);

            watchListEntityMock.parsed = true;
            expect(response).toEqual(watchListEntityMock);
        });
    });

    describe("removeWatchListItems", () => {
        test("Should throw UserNotExistsError if user does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(
                watchListService.removeWatchListItems(1, 1, [1, 2, 3])
            ).rejects.toThrow(UserNotExistsError);
        });

        test("Should throw WatchListNotFoundError if watch list does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce(undefined);

            await expect(
                watchListService.removeWatchListItems(1, 1, [1, 2, 3])
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
                watchListService.removeWatchListItems(1, 1, [1, 2, 3])
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
                watchListService.removeWatchListItems(1, 1, [1, 2, 3])
            ).rejects.toThrow(MediaNotFoundError);
        });

        test("Should do nothing if media does not exists in watch list", async () => {
            userRepositoryMock.exist.mockReturnValue(true);
            watchListRepositoryMock.findOne.mockReturnValue({
                Id: 1,
                Owner: {
                    Id: 1,
                },
            });
            mediaRepositoryMock.exist.mockReturnValue(true);
            watchListItemRepositoryMock.findOne.mockReturnValue(null);

            await watchListService.removeWatchListItems(1, 1, [1, 2, 3]);

            expect(watchListItemRepositoryMock.update).toHaveBeenCalledTimes(0);
        });

        test("Should remove media from watch list if media exists and watch list exists and belongs to user", async () => {
            userRepositoryMock.exist.mockReturnValue(true);
            watchListRepositoryMock.findOne.mockReturnValue({
                Id: 1,
                Owner: {
                    Id: 1,
                },
            });
            mediaRepositoryMock.exist.mockReturnValue(true);
            watchListItemRepositoryMock.findOne.mockReturnValue({ Id: 1 });

            await watchListService.removeWatchListItems(1, 1, [1]);

            expect(watchListItemRepositoryMock.update).toHaveBeenCalledTimes(1);
            expect(watchListItemRepositoryMock.update).toHaveBeenCalledWith(1, {
                DeletedAt: expect.any(Date),
            });
        });
    });

    describe("Update watchlist", () => {
        test("Should throw UserNotExistsError if user does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(
                watchListService.updateWatchList(
                    1,
                    1,
                    "",
                    "",
                    WatchListPrivacyType.PUBLIC
                )
            ).rejects.toThrow(UserNotExistsError);
        });

        test("Should throw WatchListNotFoundError if watch list does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce(undefined);

            await expect(
                watchListService.updateWatchList(
                    1,
                    1,
                    "",
                    "",
                    WatchListPrivacyType.PUBLIC
                )
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
                watchListService.updateWatchList(
                    1,
                    1,
                    "",
                    "",
                    WatchListPrivacyType.PUBLIC
                )
            ).rejects.toThrow(WatchListNotOwnedError);
        });

        test("Should do nothing if nothing is to be changed", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce({
                Id: 1,
                Owner: {
                    Id: 1,
                },
            });

            await watchListService.updateWatchList(
                1,
                1,
                "",
                "",
                "" as WatchListPrivacyType
            );

            expect(watchListRepositoryMock.save).not.toHaveBeenCalled();
        });

        test("Should update only title", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce({
                Id: 1,
                Owner: {
                    Id: 1,
                },
            });

            await watchListService.updateWatchList(
                1,
                1,
                "New title",
                "",
                "" as WatchListPrivacyType
            );

            expect(watchListRepositoryMock.save).toHaveBeenCalledWith({
                Id: 1,
                Title: "New title",
            });
        });

        test("Should update title and description", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce({
                Id: 1,
                Owner: {
                    Id: 1,
                },
            });

            await watchListService.updateWatchList(
                1,
                1,
                "New title",
                "New description",
                "" as WatchListPrivacyType
            );

            expect(watchListRepositoryMock.save).toHaveBeenCalledWith({
                Id: 1,
                Title: "New title",
                Description: "New description",
            });
        });

        test("Should update title, description and privacy type", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce({
                Id: 1,
                Owner: {
                    Id: 1,
                },
            });

            await watchListService.updateWatchList(
                1,
                1,
                "New title",
                "New description",
                WatchListPrivacyType.FRIENDS_ONLY
            );

            expect(watchListRepositoryMock.save).toHaveBeenCalledWith({
                Id: 1,
                Title: "New title",
                Description: "New description",
                PrivacyType: WatchListPrivacyType.FRIENDS_ONLY,
            });
        });
    });

    describe("Delete watchlist", () => {
        test("Should throw UserNotExistsError if user does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(
                watchListService.deleteWatchList(1, 1)
            ).rejects.toThrow(UserNotExistsError);
        });

        test("Should throw WatchListNotFoundError if watch list does not exist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce(undefined);

            await expect(
                watchListService.deleteWatchList(1, 1)
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
                watchListService.deleteWatchList(1, 1)
            ).rejects.toThrow(WatchListNotOwnedError);
        });

        test("Should delete watchlist", async () => {
            userRepositoryMock.exist.mockReturnValueOnce(true);
            watchListRepositoryMock.findOne.mockReturnValueOnce({
                Id: 1,
                Owner: {
                    Id: 1,
                },
            });

            await watchListService.deleteWatchList(1, 1);

            expect(watchListRepositoryMock.update).toHaveBeenCalledWith(1, {
                DeletedAt: expect.any(Date),
            });
        });
    });
});
