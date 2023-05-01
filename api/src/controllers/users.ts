import { User } from "../entity/user.entity";
import { DataSource } from "typeorm";
import { Response, Request } from "express";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import env from "../../environment";
import jwt from "jsonwebtoken";

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
            return res.status(401).json({ msg: "Invalid access." });
        }
        try {
            const passwordTest = await bcrypt.compare(
                password,
                targetUser.Password
            );
            if (!passwordTest) {
                return res.status(401).json({ msg: "Invalid access." });
            }
            const accessToken = jwt.sign(
                { id: targetUser.Id },
                env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );
            const refreshToken = jwt.sign(
                { id: targetUser.Id },
                env.REFRESH_TOKEN_SECRET,
                { expiresIn: "7d" }
            );

            targetUser.RefreshToken = refreshToken;
            await this.repository.save(targetUser);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({ accessToken });
        } catch (err) {
            let message = "Internal Server Error";
            if (err instanceof Error) message = err.message;

            return res.status(500).json({ msg: message });
        }
    }
}
