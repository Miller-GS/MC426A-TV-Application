import { NotificationAlreadyReadError } from "../../src/errors/NotificationAlreadyReadError";
import { NotificationNotFoundError } from "../../src/errors/NotificationNotFoundError";
import NotificationService from "../../src/services/notificationService";

const makeNotificationEntityMock = (entity = {} as any) => {
    return {
        Id: entity.Id || 1,
        Text: entity.Text || "test",
        UserId: entity.UserId || 1,
        ReadAt: entity.ReadAt || null,
    };
};

const makeNotificationMock = (notificationObj = {} as any) => {
    return {
        id: notificationObj.id || 1,
        userId: notificationObj.userId || 1,
        text: notificationObj.text || "Test",
        readAt: notificationObj.readAt || null,
    };
};

describe("Notification Service", () => {
    let notificationService: NotificationService;
    let notificationRepositoryMock: any;

    beforeEach(() => {
        notificationRepositoryMock = {
            find: jest.fn(),
            findOne: jest.fn(),
            exist: jest.fn(),
            update: jest.fn(),
        };

        notificationService = new NotificationService(
            notificationRepositoryMock
        );
    });

    describe("List all Notifications", () => {
        test("Should return empty list when user has no notifications", async () => {
            notificationRepositoryMock.find.mockReturnValueOnce([]);

            const response = await notificationService.listNotifications(
                1,
                true
            );

            expect(response).toEqual([]);
        });

        test("Should select corrent user on all notifications", async () => {
            await notificationService.listNotifications(2, true);
            expect(notificationRepositoryMock.find).toHaveBeenCalledWith({
                where: {
                    User: {
                        Id: 2,
                    },
                },
                withDeleted: true,
            });
        });
    });

    describe("List new Notifications", () => {
        test("Should return empty list when user has no new notifications", async () => {
            notificationRepositoryMock.find.mockReturnValueOnce([]);

            const response = await notificationService.listNotifications(
                1,
                false
            );

            expect(response).toEqual([]);
        });

        test("Should select corrent user on new notifications", async () => {
            await notificationService.listNotifications(2, false);
            expect(notificationRepositoryMock.find).toHaveBeenCalledWith({
                where: {
                    User: {
                        Id: 2,
                    },
                },
                withDeleted: false,
            });
        });
    });

    describe("Read notifications", () => {
        test("Should read notification when it exists and has not been read yet", async () => {
            notificationRepositoryMock.exist.mockReturnValueOnce(true);

            const notificationEntityMock = makeNotificationEntityMock();
            notificationRepositoryMock.findOne.mockReturnValueOnce(
                notificationEntityMock
            );

            notificationRepositoryMock.update.mockReturnValueOnce(
                notificationRepositoryMock
            );

            await notificationService.readNotification(
                notificationEntityMock.Id
            );

            expect(notificationRepositoryMock.update).toHaveBeenCalledWith(
                notificationEntityMock.Id,
                {
                    ReadAt: expect.any(Date),
                }
            );
        });

        test("Should throw error when notification does not exist", async () => {
            notificationRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(
                notificationService.readNotification(0)
            ).rejects.toThrow(NotificationNotFoundError);
        });

        test("Should throw error when notification has already been read", async () => {
            notificationRepositoryMock.findOne.mockReturnValueOnce({
                Id: 0,
                Text: "",
                ReadAt: new Date(),
            });

            await expect(
                notificationService.readNotification(0)
            ).rejects.toThrow(NotificationAlreadyReadError);
        });
    });
});
