import { ValidationUtils } from "./validationUtils";

export class ConvertionUtils {
    static stringToBoolean(str: string, default_value: any = undefined): boolean {
        const truth_values = ["1", "true"];
        const false_values = ["0", "false"];

        if (ValidationUtils.isEmpty(str)) {
            return default_value;
        }

        const lower_str = str.toString().toLowerCase();

        if (truth_values.includes(lower_str)) {
            return true;
        } else if (false_values.includes(lower_str)) {
            return false;
        } else {
            return default_value;
        }
    }
}
