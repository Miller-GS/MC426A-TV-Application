import { HttpUtils } from "../../src/utils/httpUtils";

describe("buildQuery", () => {
    test("Query with no arguments", async () => {
        const response = HttpUtils.buildQuery({});
        expect(response).toEqual("");
    });

    test("Query with undefined object", async () => {
        const response = HttpUtils.buildQuery(undefined);
        expect(response).toEqual("");
    });

    test("Query with object with 1 key", async () => {
        const response = HttpUtils.buildQuery({key: "value"});
        expect(response).toEqual("key=value");
    });

    test("Query with object with multiple keys", async () => {
        const response = HttpUtils.buildQuery({key1: "value1", key2: "value2"});
        expect(response).toEqual("key1=value1&key2=value2");
    });

    test("Query with object with special characters", async () => {
        const response = HttpUtils.buildQuery({key1: " ", key2: "?", key3: "&", key4: "", key5: undefined});
        expect(response).toEqual("key1=%20&key2=%3F&key3=%26");
    });
});