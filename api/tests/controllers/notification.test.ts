import NotificationController from "../../src/controllers/notification";
import { NotificationAlreadyReadError } from "../../src/errors/NotificationAlreadyReadError";
import { NotificationNotFoundError } from "../../src/errors/NotificationNotFoundError";

describe("Notification controller", () => {
    let notificationController: NotificationController;
    let notificationService: any;

    beforeEach(() => {
        notificationService = {
            listNotifications: jest.fn(),
            readNotification: jest.fn(),
        };
        notificationController = new NotificationController(
            notificationService
        );
    });

    describe("listNotifications", () => {
        test("Should return 200 and empty list when user has no notifications", async () => {
            const req: any = {
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            notificationService.listNotifications.mockResolvedValueOnce([]);

            await notificationController.listNotifications(req, res);

            expect(notificationService.listNotifications).toHaveBeenCalledWith(
                1,
                false
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        test("Should return 200 and empty list when user has no notifications with all query parameter as true", async () => {
            const req: any = {
                user: {
                    id: 1,
                },
                query: {
                    all: true,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            notificationService.listNotifications.mockResolvedValueOnce([]);

            await notificationController.listNotifications(req, res);

            expect(notificationService.listNotifications).toHaveBeenCalledWith(
                1,
                true
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        test("Should return 401 if user is not logged in", async () => {
            const req: any = {};
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await notificationController.listNotifications(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
        });

        test("Should return 500 when an error occurs", async () => {
            const req: any = {
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            notificationService.listNotifications.mockRejectedValueOnce(
                new Error()
            );

            await notificationController.listNotifications(req, res);

            expect(notificationService.listNotifications).toHaveBeenCalledWith(
                1,
                false
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
            });
        });

        test("Should call service with all notifications", async () => {
            const req: any = {
                user: {
                    id: 1,
                },
                query: {
                    all: true,
                },
            };

            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const now = new Date();

            notificationService.listNotifications.mockResolvedValueOnce([
                {
                    Id: 1,
                    Text: "text 1",
                    User: {
                        Id: 1,
                    },
                    ReadAt: null,
                },
                {
                    Id: 2,
                    Text: "text 2",
                    User: null,
                    ReadAt: now,
                },
            ]);

            await notificationController.listNotifications(req, res);

            expect(notificationService.listNotifications).toHaveBeenCalledWith(
                1,
                true
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                {
                    id: 1,
                    text: "text 1",
                    userId: 1,
                    read: false,
                },
                {
                    id: 2,
                    text: "text 2",
                    userId: null,
                    read: true,
                },
            ]);
        });
    });

    describe("readNotification", () => {
        test("Should mark notification as read", async () => {
            const req: any = {
                user: {
                    id: 1,
                },
                params: {
                    notificationId: 1,
                },
            };

            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            notificationService.readNotification.mockResolvedValueOnce({});

            await notificationController.readNotification(req, res);

            expect(notificationService.readNotification).toHaveBeenCalledWith(
                1
            );
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith();
        });

        test("Should return NotificationNotFound error", async () => {
            const req: any = {
                user: {
                    id: 1,
                },
                params: {
                    notificationId: 10,
                },
            };

            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            notificationService.readNotification.mockRejectedValueOnce(
                new NotificationNotFoundError()
            );

            await notificationController.readNotification(req, res);

            expect(notificationService.readNotification).toHaveBeenCalledWith(
                10
            );
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Notification not found",
            });
        });

        test("Should return NotificationAlreadyRead error", async () => {
            const req: any = {
                user: {
                    id: 1,
                },
                params: {
                    notificationId: "3",
                },
            };

            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            notificationService.readNotification.mockRejectedValueOnce(
                new NotificationAlreadyReadError()
            );

            await notificationController.readNotification(req, res);

            expect(notificationService.readNotification).toHaveBeenCalledWith(
                3
            );
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.json).toHaveBeenCalledWith({
                message: "Notification has already been read",
            });
        });

        test("Should return invalid notification id error", async () => {
            const req: any = {
                user: {
                    id: 1,
                },
                params: {
                    notificationId: 0,
                },
            };

            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            notificationService.readNotification.mockResolvedValueOnce({});

            await notificationController.readNotification(req, res);

            expect(notificationService.readNotification).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Notification ID necessary",
            });
        });

        test("Should return 500 when an error occurs", async () => {
            const req: any = {
                params: {
                    notificationId: 1,
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            notificationService.readNotification.mockRejectedValueOnce(new Error());

            await notificationController.readNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
            });
        });

        test("Should return 401 when user is not logged in", async () => {
            const req: any = {
                params: {
                    notificationId: 1,
                },
                user: undefined,
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await notificationController.readNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
        });
    });
});
