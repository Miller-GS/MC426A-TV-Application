import { ValidationUtils } from "./validationUtils";

export class ParseUtils {
    static parseIntOrUndefined(value) {
        return ValidationUtils.isEmpty(value) || isNaN(value) ? undefined : parseInt(value);
    }

    static parseFloatOrUndefined(value) {
        return ValidationUtils.isEmpty(value) || isNaN(value) ? undefined : parseFloat(value);
    }
}