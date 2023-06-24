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
            const userId: number = 2;

            notificationCreator = new TestCommentNotification(
                notificationRepositoryMock,
                userId
            );

            notificationRepositoryMock.save.mockReturnValueOnce({
                Id: 1,
                User: {
                    Id: userId,
                },
                Text: "Test",
                Type: NotificationType.COMMENT_REPLY,
            });

            const result = await notificationCreator.saveNotification();
            const response = makeNotificationMock({ userId: userId });

            expect(notificationRepositoryMock.save).toHaveBeenCalledWith({
                User: {
                    Id: userId,
                },
                Text: "Test",
                Type: NotificationType.COMMENT_REPLY,
            });
            expect(result).toEqual(response);
        });

        test("Should throw error with invalid user id 0", async () => {
            const userId: number = 0;
            notificationCreator = new TestCommentNotification(
                notificationRepositoryMock,
                userId
            );

            await expect(
                notificationCreator.saveNotification()
            ).rejects.toThrow(UserIdError);
        });

        test("Should throw error with invalid user id -1", async () => {
            const userId: number = -1;
            notificationCreator = new TestCommentNotification(
                notificationRepositoryMock,
                userId
            );

            await expect(
                notificationCreator.saveNotification()
            ).rejects.toThrow(UserIdError);
        });

        test("Should throw error with empty notification error", async () => {
            const userId: number = 10;
            notificationCreator = new EmptyTestNotification(
                notificationRepositoryMock,
                userId
            );

            await expect(
                notificationCreator.saveNotification()
            ).rejects.toThrow(EmptyNotificationError);
        });
    });
});
