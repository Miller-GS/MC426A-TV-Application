import { DataSource } from "typeorm";
import { Response, Request } from "express";
import { Notification } from "../entity/notification.entity";
import { ValidationUtils } from "../utils/validationUtils";
import { User } from "../entity/user.entity";

export default class NotificationsController {
    private repository;

    public constructor(appDataSource: DataSource) {
        this.repository = appDataSource.getRepository(Notification);
    }

    public async list(req, res: Response) {
        const user = req.user;

        if (!user) {
            return res
                .status(404)
                .json({ msg: `User not found` });
        }

        const notifications = await this.repository.find({
            relations: {
                User: true,
            },
            where: {
                User: {
                    Id: user.id,
                },
            },
        });

        return res.status(200).json(notifications);
    }
}
