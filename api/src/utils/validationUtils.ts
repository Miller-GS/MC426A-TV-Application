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
        var numberRegex = /^[1-9]+$/;
        return numberRegex.test(str);
    }

    static isValidEmail(str) {
        var emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(str);
    }
}
