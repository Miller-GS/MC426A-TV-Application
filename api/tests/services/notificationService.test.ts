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

    describe("List Notifications", () => {
        test("Should return empty list when user has no notifications", async () => {
            notificationRepositoryMock.find.mockReturnValueOnce([]);

            const response = await notificationService.listNotifications(1);

            expect(response).toEqual([]);
        });

        test("Should return empty list when there are notifications that do not belong to user", async () => {
            await notificationService.listNotifications(2);
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
});
