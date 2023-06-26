import { WatchListPrivacyType } from "../../src/entity/watchList.entity";
import { EmptyWatchListDescriptionError } from "../../src/errors/EmptyWatchListDescriptionError";
import { EmptyWatchListTitleError } from "../../src/errors/EmptyWatchListTitleError";
import { UserNotExistsError } from "../../src/errors/UserNotExistsError";
import WatchListService from "../../src/services/watchListService";

const makeWatchListEntityMock = (entity = {} as any) => {
    return {
        Id: entity.Id || 1,
        User: {
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

    beforeEach(() => {
        watchListRepositoryMock = {
            save: jest.fn(),
        };

        watchListItemRepositoryMock = {};

        userRepositoryMock = {
            exist: jest.fn(),
        };

        watchListService = new WatchListService(
            watchListRepositoryMock,
            watchListItemRepositoryMock,
            userRepositoryMock
        );
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
                User: {
                    Id: 1,
                },
                Title: "WatchList title",
                Description: "WatchList description",
                PrivacyType: WatchListPrivacyType.PUBLIC,
            });
        });
    });
});
