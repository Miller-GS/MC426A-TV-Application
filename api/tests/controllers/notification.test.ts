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

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
            });
        });
    });
});
