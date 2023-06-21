import { NotificationType } from "../../src/entity/notification.entity";
import { EmptyNotificationError } from "../../src/errors/EmptyNotificationError";
import { UserIdError } from "../../src/errors/UserIdError";
import NotificationCreationService from "../../src/services/notificationCreationService";

class TestCommentNotification extends NotificationCreationService {
    getNotificationText(): string {
        return "Test";
    }

    getNotificationType(): NotificationType {
        return NotificationType.COMMENT_REPLY;
    }
}

class EmptyTestNotification extends NotificationCreationService {
    getNotificationText(): string {
        return "";
    }

    getNotificationType(): NotificationType {
        return NotificationType.COMMENT_REPLY;
    }
}

const makeNotificationMock = (notificationObj = {} as any) => {
    return {
        id: notificationObj.id || 1,
        userId: notificationObj.userId || 1,
        text: notificationObj.text || "Test",
        read: notificationObj.read || false,
    };
};

describe("Notification Creation Service", () => {
    let notificationCreator: TestCommentNotification;
    let notificationRepositoryMock: any;

    beforeEach(() => {
        notificationRepositoryMock = {
            save: jest.fn(),
        };
    });

    describe("Reply Notification", () => {
        test("Should save notification for comment reply", async () => {
            notificationCreator = new TestCommentNotification(
                notificationRepositoryMock
            );

            notificationRepositoryMock.save.mockReturnValueOnce({
                Id: 1,
                User: {
                    Id: 2,
                },
                Text: "Test",
                Type: NotificationType.COMMENT_REPLY,
            });

            const result = await notificationCreator.saveNotification(2);
            const response = makeNotificationMock({ userId: 2 });

            expect(notificationRepositoryMock.save).toHaveBeenCalledWith({
                User: {
                    Id: 2,
                },
                Text: "Test",
                Type: NotificationType.COMMENT_REPLY,
            });
            expect(result).toEqual(response);
        });

        test("Should throw error with invalid user id 0", async () => {
            notificationCreator = new TestCommentNotification(
                notificationRepositoryMock
            );

            const userId = 0;
            await expect(
                notificationCreator.saveNotification(userId)
            ).rejects.toThrow(UserIdError);
        });

        test("Should throw error with invalid user id -1", async () => {
            notificationCreator = new TestCommentNotification(
                notificationRepositoryMock
            );

            const userId = -1;
            await expect(
                notificationCreator.saveNotification(userId)
            ).rejects.toThrow(UserIdError);
        });

        test("Should throw error with invalid user id -1", async () => {
            notificationCreator = new EmptyTestNotification(
                notificationRepositoryMock
            );
            await expect(
                notificationCreator.saveNotification(10)
            ).rejects.toThrow(EmptyNotificationError);
        });
    });
});
