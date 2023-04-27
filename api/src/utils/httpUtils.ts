import { ValidationUtils } from "./validationUtils";

export class HttpUtils {
    static buildQuery(obj) {
        if (obj == undefined) return "";

        return Object.keys(obj)
            .filter((key) => !ValidationUtils.isEmpty(obj[key]))
            .map((key) => {
                return `${key}=${encodeURIComponent(obj[key])}`;
            })
            .join("&");
    }
}
