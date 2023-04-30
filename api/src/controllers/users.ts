import bcrypt from "bcrypt";
import {User} from "../entity/user.entity"; //import User entity
import appDataSource from "../config/ormconfig";

export default class UsersController {
    private repository;

    public constructor() {
        this.repository = appDataSource.getRepository(User);
    }

    public async register(req, res) {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        const duplicate = await this.repository.findOne({ where: { Email: email } });
        if (duplicate) {
            return res.status(409).json({ msg: "User already exists" });
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.repository.save({ Name: name, Email: email, Password: hashedPassword });
            console.log(user);
            return res.status(201).json({ msg: "User created successfully" });
        }
        catch (err) {
            let message = 'Internal Server Error'
            if (err instanceof Error) message = err.message

            return res.status(500).json({ msg: message});
        }
    }
}
