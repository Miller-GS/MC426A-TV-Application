import bcrypt from "bcrypt";
import { User } from "../entity/user.entity";
import { DataSource } from "typeorm";
import { Response, Request } from "express";

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
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
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
}
