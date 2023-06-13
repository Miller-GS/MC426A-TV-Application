import { User } from "../entity/user.entity";
import { Friendship, FriendshipStatus } from "../entity/friendship.entity";
import { ValidationUtils } from "../utils/validationUtils";
import { DataSource, In } from "typeorm";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import env from "../../environment";
import jwt from "jsonwebtoken";

export default class UsersController {
    private repository;
    private friendshipRepository;

    public constructor(appDataSource: DataSource) {
        this.repository = appDataSource.getRepository(User);
        this.friendshipRepository = appDataSource.getRepository(Friendship);
    }

    public async register(req: Request, res: Response) {
        const { name, email, password } = req.body;
        if (ValidationUtils.isAnyStringEmpty(name, email, password)) {
            return res
                .status(400)
                .json({ msg: "Name, email and password required." });
        }
        if (!ValidationUtils.isValidEmail(email)) {
            return res.status(400).json({ msg: "Invalid email." });
        }

        const duplicate = await this.repository.findOne({
            where: { Email: email },
        });
        if (duplicate) {
            return res.status(409).json({ msg: "User already exists" });
        }

        let pass = password.toString();
        const hashedPassword = await bcrypt.hash(pass, 10);
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

    public async handleRefreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ msg: "No refresh token provided." });
        }
        const user = await this.repository.findOne({
            where: { RefreshToken: refreshToken },
        });
        if (!user) {
            return res.status(403).json({ msg: "Invalid refresh token." });
        }
        jwt.verify(
            refreshToken,
            env.REFRESH_TOKEN_SECRET,
            async (err, user_token) => {
                if (err || user_token.id !== user.Id) {
                    return res
                        .status(403)
                        .json({ msg: "Invalid refresh token." });
                }
                const accessToken = jwt.sign(
                    { id: user.Id },
                    env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "15m" }
                );
                return res.status(200).json({ accessToken });
            }
        );
    }

    public async logout(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(204).json({ msg: "No refresh token provided." });
        }
        const user = await this.repository.findOne({
            where: { RefreshToken: refreshToken },
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
        });
        if (user) await this.repository.update(user.Id, { RefreshToken: null });

        return res.status(204).json({ msg: "Logged out successfully." });
    }

    public async getFriends(req: Request, res: Response) {
        const userRepository = this.repository;
        const friendshipRepository = this.friendshipRepository;

        const userId = req.params.id;

        const friendships = await friendshipRepository.find({ user_id1: userId });

        if (friendships.length === 0) {
            return res.status(200).json([]);
        }

        const friends = await userRepository.findByIds(friendships.map(friendship => friendship.user_id2));
        return res.status(200).json(friends);
    }

    public async acceptFriend(req: Request, res: Response) {
        const friendshipRepository = this.friendshipRepository;

        const user1Id = Number(req.params.id);
        const user2Id = Number(req.body.friendId);

        const friendship = await friendshipRepository.findOne({ where: { user_id1: user1Id, user_id2: user2Id } });

        if (friendship.status !== FriendshipStatus.PENDING) {
            throw new Error('Friendship not pending');
        }

        friendship.status = FriendshipStatus.ACCEPTED;
        await friendshipRepository.save(friendship);
    }

    public async addFriend(req: Request, res: Response) {
        const userRepository = this.repository;
        const friendshipRepository = this.friendshipRepository;

        const user1Id = Number(req.params.id);
        const friendId = Number(req.body.friendId);
        // Check if users exist
        const user1 = await userRepository.find({
            where: {
                Id: user1Id
            }
        });

        const user2 = await userRepository.find({
            where: {
                Id: friendId
            }
        });

        if (!user1 || !user2) {
            throw new Error('One or both users not found');
        }

        // Check if friendship already exists
        const existingFriendship = await friendshipRepository.findOne({ where: { user_id1: user1Id, user_id2: friendId } });

        if (existingFriendship) {
            throw new Error('Friendship already exists');
        }

        // Create new friendship
        const newFriendship = new Friendship();
        newFriendship.user_id1 = user1Id;
        newFriendship.user_id2 = friendId;
        newFriendship.status = FriendshipStatus.PENDING;
        newFriendship.action_user_id = user1Id; // The user who initiated the friendship is the action_user

        // Save the friendship
        await friendshipRepository.save(newFriendship);
        return res.status(200).json(newFriendship);
    }

    public async getfriends(req: Request, res: Response) {
        const friendshipRepository = this.friendshipRepository;
        const userRepository = this.repository;
        const userId = req.params.id;
        const friendships = await friendshipRepository.find({ user_id1: userId });

        if (friendships.length === 0) {
            const friends = userRepository.find({ where: { Id: In(friendships.map(({ user_id2 }) => user_id2)) } });
            return res.status(200).json(friends);
        }

        return res.status(200).json([]);
    }
}
