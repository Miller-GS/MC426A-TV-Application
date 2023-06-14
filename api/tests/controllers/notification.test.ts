import NotificationController from "../../src/controllers/notification";

describe("Notification controller", () => {
    let notificationController: NotificationController;
    let notificationService: any;

    beforeEach(() => {
        notificationService = {
            listNotifications: jest.fn(),
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
});
