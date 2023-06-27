import { MyTVListError } from "../errors/MyTVListError";
import { Response } from "express";
import { ValidationUtils } from "./validationUtils";

export class ErrorUtils {
    static handleError(err: Error, res: Response) {
        if (err instanceof MyTVListError) {
            return res.status(err.getStatus()).json({
                message: err.message,
            });
        }

        let message = "Internal server error";
        if (err instanceof Error && !ValidationUtils.isEmpty(err.message))
            message = err.message;

        return res.status(500).json({
            message: message,
        });
    }
}
