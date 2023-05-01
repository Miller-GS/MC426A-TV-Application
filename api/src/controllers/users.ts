import { User } from "../entity/user.entity";
import { DataSource } from "typeorm";
import { Response, Request } from "express";
import { randomUUID } from "crypto";

export default class UsersController {
    public repository;

    public constructor(appDataSource: DataSource) {
        this.repository = appDataSource.getRepository(User);
    }

    public async register(req: Request, res: Response) {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ msg: "Name, email and password required." });
        }

        const duplicate = await this.repository.findOne({
            where: { Email: email },
        });
        if (duplicate) {
            return res.status(409).json({ msg: "User already exists" });
        }
        try {
            await this.repository.save({
                Name: name,
                Email: email,
                Password: password,
            });
            return res.status(201).json({ msg: "User created successfully" });
        } catch (err) {
            let message = "Internal Server Error";
            if (err instanceof Error) message = err.message;

            return res.status(500).json({ msg: message });
        }
    }

    public async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ msg: "Email and password required." });
        }

        var targetUser = this.repository.findOne({
            where: { Email: email },
        });

        if (!targetUser) {
            return res.status(400).json({ msg: "Invalid access." });
        }

        try {
            var userPassword = targetUser.Password;
            var passwordTest = password.localeCompare(targetUser.Password);
            if (passwordTest != 0) {
                return res.status(400).json({ msg: "Invalid access." });
            } else {
                var sessionToken = randomUUID;
                targetUser.SessionToken = sessionToken.toString();
                targetUser.IsSessionTokenValid = true;
                await this.repository.save(targetUser.id, targetUser);

                return res.status(200);
            }
        } catch (err) {
            let message = "Internal Server Error";
            if (err instanceof Error) message = err.message;

            return res.status(500).json({ msg: message });
        }
    }
}

