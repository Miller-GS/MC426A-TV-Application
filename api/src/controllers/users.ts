import { ValidationUtils } from "../utils/validationUtils";
import { Response, Request } from "express";
import UserService from "../services/userService";
import { ErrorUtils } from "../utils/errorUtils";

export default class UsersController {
    private userService: UserService;

    public constructor(userService: UserService) {
        this.userService = userService;
    }

    public async register(req: Request, res: Response) {
        const { name, email, password } = req.body;
        if (ValidationUtils.isAnyStringEmpty(name, email, password)) {
            return res
                .status(400)
                .json({ message: "Name, email and password required." });
        }
        if (!ValidationUtils.isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email." });
        }

        try {
            await this.userService.register(name, email, password);
            return res.status(201).json({ message: "User created successfully" });
        } catch (err: any) {
            ErrorUtils.handleError(err, res);
        }
    }

    public async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (ValidationUtils.isAnyStringEmpty(email, password)) {
            return res
                .status(400)
                .json({ message: "Email and password required." });
        }

        try {
            const tokens = await this.userService.login(email, password);
            const accessToken = tokens.accessToken;
            const refreshToken = tokens.refreshToken;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({ accessToken });
        } catch (err: any) {
            ErrorUtils.handleError(err, res);
        }
    }

    public async handleRefreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken)
            return res.status(401).json({ message: "No refresh token provided." });

        try {
            const accessToken = await this.userService.getNewAccessToken(
                refreshToken
            );
            return res.status(200).json({ accessToken });
        } catch (err: any) {
            ErrorUtils.handleError(err, res);
        }
    }

    public async logout(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if (ValidationUtils.isEmpty(refreshToken)) {
            return res.status(204).json({ message: "No refresh token provided." });
        }

        try {
            await this.userService.logout(refreshToken);

            res.clearCookie("refreshToken", {
                httpOnly: true,
            });

            return res.status(204).json({ message: "Logged out successfully." });
        } catch (err: any) {
            ErrorUtils.handleError(err, res);
        }
    }
}
