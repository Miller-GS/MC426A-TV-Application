import { Response, Request } from "express";
import { ValidationUtils } from "../utils/validationUtils";
import NotificationService from "../services/notificationService";
import { ErrorUtils } from "../utils/errorUtils";
import { ConvertionUtils } from "../utils/convertionUtils";
import { NotificationParser } from "../models/notification";

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
            withDeleted = ConvertionUtils.stringToBoolean(req.query["all"] as string, false);

        try {
            const notifications =
                await this.notificationService.listNotifications(userId, withDeleted);
            return res.status(200).json(NotificationParser.parseNotifications(notifications));
        } catch (err: any) {
            console.error(err.message);
            ErrorUtils.handleError(err, res);
        }
    }
}
