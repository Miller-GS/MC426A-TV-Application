import { ValidationUtils } from "./validationUtils";

export class ParseUtils {
    static parseIntOrUndefined(value) {
        return ValidationUtils.isEmpty(value) || isNaN(value)
            ? undefined
            : parseInt(value);
    }

    static parseFloatOrUndefined(value) {
        return ValidationUtils.isEmpty(value) || isNaN(value)
            ? undefined
            : parseFloat(value);
    }

    static parseBoolean(
        str: string | null | undefined,
        default_value: any = undefined
    ): boolean {
        const truth_values = ["1", "true"];
        const false_values = ["0", "false"];

        if (ValidationUtils.isEmpty(str)) {
            return default_value;
        }

        const lower_str = str?.toString().toLowerCase();

        if (truth_values.includes(lower_str + "")) {
            return true;
        } else if (false_values.includes(lower_str + "")) {
            return false;
        } else {
            return default_value;
        }
    }
}
