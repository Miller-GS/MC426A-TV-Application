import { MyTVListError } from "./MyTVListError";

export class InvalidRefreshTokenError extends MyTVListError {
    public constructor() {
        super("Invalid refresh token", 403);
    }
}
