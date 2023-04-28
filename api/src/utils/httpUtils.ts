export class HttpUtils {
    static buildQuery(obj) {
        return Object.keys(obj)
            .map((key) => {
                return `${key}=${encodeURIComponent(obj[key])}`;
            })
            .join("&");
    }
}