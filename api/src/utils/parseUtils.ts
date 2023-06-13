export class ParseUtils {
    static parseIntOrUndefined(value) {
        return isNaN(value) ? undefined : parseInt(value);
    }

    static parseFloatOrUndefined(value) {
        return isNaN(value) ? undefined : parseFloat(value);
    }
}