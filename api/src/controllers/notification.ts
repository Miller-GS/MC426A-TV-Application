import { Response, Request } from "express";
import { ValidationUtils } from "../utils/validationUtils";
import NotificationService from "../services/notificationService";
import { ErrorUtils } from "../utils/errorUtils";

export default class NotificationController {
    private notificationService: NotificationService;

    public constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
    }

    public async listNotifications(req: Request, res: Response) {
        if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;
        const userId = req["user"].id;

        try {
            const notifications = await this.notificationService.listNotifications(userId, true);
            return res.status(200).json(notifications);
        } catch (err: any) {
            console.error(err.message);
            ErrorUtils.handleError(err, res);
        }
    }

    public async listNewNotifications(req: Request, res: Response) {
        if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;
        const userId = req["user"].id;

        try {
            const notifications = await this.notificationService.listNotifications(userId, false);
            return res.status(200).json(notifications);
        } catch (err: any) {
            console.error(err.message);
            ErrorUtils.handleError(err, res);
        }
    }
}
