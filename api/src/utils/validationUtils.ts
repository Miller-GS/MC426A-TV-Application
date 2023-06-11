export class ValidationUtils {
    static isEmpty(str) {
        return str == "" || str == undefined || str == null;
    }

    static isAnyStringEmpty(...strs) {
        for (let str of strs) {
            if (this.isEmpty(str)) return true;
        }
        return false;
    }

    static isPositiveNumber(str) {
        const numberRegex = /^[1-9]+$/;
        return numberRegex.test(str);
    }

    static isValidEmail(str) {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(str);
    }

    static validateUserLoggedIn(req, res) {
        const user = req["user"];
        if (ValidationUtils.isEmpty(user)) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return false;
        }
        return true;
    }
}
