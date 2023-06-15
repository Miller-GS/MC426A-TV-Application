import { MyTVListError } from "../errors/MyTVListError";
import { Response } from "express";

export class ErrorUtils {
    static handleError(err: Error, res: Response) {
        if (err instanceof MyTVListError) {
            return res.status(err.getStatus()).json({
                message: err.message,
            });
        }
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
