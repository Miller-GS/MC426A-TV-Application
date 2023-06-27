import { FriendshipStatus } from "../../src/entity/friendship.entity";
import { NotificationType } from "../../src/entity/notification.entity";
import { FriendshipAlreadyExistError } from "../../src/errors/FriendshipAlreadyExistError";
import { FriendshipNotFoundError } from "../../src/errors/FriendshipNotFoundError";
import { SelfFriendshipError } from "../../src/errors/SelfFriendshipError";
import FriendshipService from "../../src/services/friendshipService";

const makeFriendshipEntityMock = (entity = {} as any) => {
    return {
        UserId1: entity.UserId1 || 1,
        UserId2: entity.UserId2 || 2,
        Status: entity.Status || FriendshipStatus.PENDING,
        ActionUserId: entity.ActionUserId || 1,
    };
};

describe("Friendship Service", () => {
    let friendshipService: FriendshipService;
    let friendshipRepositoryMock: any;
    let notificationRepositoryMock: any;

    beforeEach(() => {
        friendshipRepositoryMock = {
            find: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            exist: jest.fn(),
        };

        notificationRepositoryMock = {
            save: jest.fn(),
        };

        friendshipService = new FriendshipService(
            friendshipRepositoryMock,
            notificationRepositoryMock
        );
    });

    describe("Create friendship", () => {
        test("Should throw FriendshipAlreadyExistError if friendship already exists", async () => {
            friendshipRepositoryMock.exist.mockReturnValueOnce(true);

            await expect(
                friendshipService.createFriendship(
                    1,
                    2,
                    FriendshipStatus.PENDING,
                    1
                )
            ).rejects.toThrow(FriendshipAlreadyExistError);
        });

        test("Should throw SelfFriendshipError if sender is also receiver", async () => {
            await expect(
                friendshipService.createFriendship(
                    1,
                    1,
                    FriendshipStatus.PENDING,
                    1
                )
            ).rejects.toThrow(SelfFriendshipError);
        });

        test("Should create friendship request if friendship does not exist", async () => {
            friendshipRepositoryMock.exist.mockReturnValueOnce(false);

            const friendshipEntity = makeFriendshipEntityMock();
            friendshipRepositoryMock.save.mockReturnValueOnce(friendshipEntity);

            const response = await friendshipService.createFriendship(
                1,
                2,
                FriendshipStatus.PENDING,
                1
            );
            expect(notificationRepositoryMock.save).toHaveBeenCalledWith({
                User: {
                    Id: 2,
                },
                Text: "User 1 wants to add you as a friend.",
                Type: NotificationType.FRIEND_REQUEST,
            });
            expect(response).toEqual(friendshipEntity);
        });
    });

    describe("Reply friendship", () => {
        test("Should throw FriendshipNotFoundError if friendship does not exist", async () => {
            friendshipRepositoryMock.findOne.mockReturnValueOnce(null);

            await expect(
                friendshipService.replyFriendshipRequest(1, 2, true)
            ).rejects.toThrow(FriendshipNotFoundError);
        });

        test("Should accept friendship and send notification", async () => {
            const friendshipEntity = makeFriendshipEntityMock();
            friendshipRepositoryMock.findOne.mockReturnValueOnce(
                friendshipEntity
            );

            const response = await friendshipService.replyFriendshipRequest(
                1,
                2,
                true
            );

            expect(notificationRepositoryMock.save).toHaveBeenCalledWith({
                User: {
                    Id: 1,
                },
                Text: "User 2 accepted your friendship request.",
                Type: NotificationType.FRIEND_REQUEST,
            });
            expect(response).toEqual(
                makeFriendshipEntityMock({ Status: FriendshipStatus.ACCEPTED })
            );
        });

        test("Should decline friendship and not send notification", async () => {
            const friendshipEntity = makeFriendshipEntityMock();
            friendshipRepositoryMock.findOne.mockReturnValueOnce(
                friendshipEntity
            );

            const response = await friendshipService.replyFriendshipRequest(
                1,
                2,
                false
            );

            expect(notificationRepositoryMock.save).not.toHaveBeenCalled();
            expect(response).toEqual(
                makeFriendshipEntityMock({ Status: FriendshipStatus.DECLINED })
            );
        });
    });

    describe("List friends", () => {
        test("Should return empty list if user has no accepted friends", async () => {
            friendshipRepositoryMock.find.mockReturnValueOnce([]);

            expect(await friendshipService.listFriends(1)).toEqual([]);
        });

        test("Should return id list if user has accepted friends", async () => {
            friendshipRepositoryMock.find.mockReturnValueOnce([
                makeFriendshipEntityMock({ UserId2: 2 }),
                makeFriendshipEntityMock({ UserId2: 3 }),
                makeFriendshipEntityMock({ UserId2: 4 }),
                makeFriendshipEntityMock({ UserId2: 5 }),
            ]);

            expect(await friendshipService.listFriends(1)).toEqual([
                2, 3, 4, 5,
            ]);
        });
    });
});
