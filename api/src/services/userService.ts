import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import env from "../../environment";
import { UserEntity } from "../entity/user.entity";
import { InvalidAccessError } from "../errors/InvalidAccessError";
import { InvalidRefreshTokenError } from "../errors/InvalidRefreshTokenError";
import { UserAlreadyExistsError } from "../errors/UserAlreadyExistsError";
import { UserNotExistsError } from "../errors/UserNotExistsError";

export default class UserService {
    private userRepository: any;

    public constructor(userRepository: Repository<UserEntity>) {
        this.userRepository = userRepository;
    }

    public async register(name: string, email: string, password: string) {
        const duplicate = await this.userRepository.findOne({
            where: { Email: email },
        });

        if (duplicate) throw new UserAlreadyExistsError();

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userRepository.save({
            Name: name,
            Email: email,
            Password: hashedPassword,
        });
    }

    public async login(email: string, password: string) {
        const targetUser = await this.userRepository.findOne({
            where: { Email: email },
        });

        if (!targetUser) throw new UserNotExistsError();

        const passwordTest = await bcrypt.compare(
            password,
            targetUser.Password
        );
        if (!passwordTest) throw new InvalidAccessError();

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
        await this.userRepository.save(targetUser);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    public async logout(refreshToken: string) {
        const user = await this.userRepository.findOne({
            where: { RefreshToken: refreshToken },
        });

        if (user)
            await this.userRepository.update(user.Id, { RefreshToken: null });
    }

    public async getNewAccessToken(refreshToken: string) {
        const user = await this.userRepository.findOne({
            where: { RefreshToken: refreshToken },
        });

        if (!user) throw new InvalidRefreshTokenError();

        try {
            const user_token = jwt.verify(
                refreshToken,
                env.REFRESH_TOKEN_SECRET
            );

            if (user_token.id !== user.Id) throw new Error();

            const accessToken = jwt.sign(
                { id: user.Id },
                env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            return accessToken;
        } catch (err: any) {
            throw new InvalidRefreshTokenError();
        }
    }
}
