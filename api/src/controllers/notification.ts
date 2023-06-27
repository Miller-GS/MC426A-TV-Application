import { Response, Request } from "express";
import { ValidationUtils } from "../utils/validationUtils";
import NotificationService from "../services/notificationService";
import { ErrorUtils } from "../utils/errorUtils";
import { NotificationParser } from "../models/notification";
import { ParseUtils } from "../utils/parseUtils";

export default class NotificationController {
    private notificationService: NotificationService;

    public constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
    }

    public async listNotifications(req: Request, res: Response) {
        if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;
        const userId = req["user"].id;

        let withDeleted = false;
        if (!ValidationUtils.isNull(req.query))
            withDeleted = ParseUtils.parseBoolean(
                req.query["all"] as string,
                false
            );

        try {
            const notifications =
                await this.notificationService.listNotifications(
                    userId,
                    withDeleted
                );
            return res
                .status(200)
                .json(NotificationParser.parseNotifications(notifications));
        } catch (err: any) {
            console.error(err.message);
            ErrorUtils.handleError(err, res);
        }
    }

    public async readNotification(req: Request, res: Response) {
        if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;

        const notificationId = req.params["notificationId"];
        if (!this.validateNotificationId(notificationId, res)) return res;

        try {
            await this.notificationService.readNotification(
                parseInt(notificationId)
            );
            return res.status(204).json();
        } catch (err: any) {
            console.error(err.message);
            return ErrorUtils.handleError(err, res);
        }
    }

    private validateNotificationId(notificationId: any, res: Response) {
        if (
            ValidationUtils.isEmpty(notificationId) ||
            !ValidationUtils.isPositiveNumber(notificationId)
        ) {
            res.status(400).json({
                message: "Bad request: Notification ID necessary",
            });
            return false;
        }
        return true;
    }
}
