import { User } from "../entity/user.entity";
import { DataSource } from "typeorm";
import { Response, Request } from "express";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export default class UsersController {
    private repository;

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
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            await this.repository.save({
                Name: name,
                Email: email,
                Password: hashedPassword,
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

        const targetUser = await this.repository.findOne({
            where: { Email: email },
        });

        if (!targetUser) {
            return res.status(400).json({ msg: "Invalid access." });
        }
        try {
            const passwordTest = await bcrypt.compare(
                password,
                targetUser.Password
            );
            if (!passwordTest) {
                return res.status(400).json({ msg: "Invalid access." });
            } else {
                const sessionToken = randomUUID({ disableEntropyCache: true });
                targetUser.SessionToken = sessionToken.toString();
                targetUser.IsSessionTokenValid = true;
                await this.repository.save(targetUser);

                return res.status(200).json({ sessionToken });
            }
        } catch (err) {
            let message = "Internal Server Error";
            if (err instanceof Error) message = err.message;

            return res.status(500).json({ msg: message });
        }
    }
}
