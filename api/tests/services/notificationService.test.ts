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
});
