import { ParseUtils } from "../../src/utils/parseUtils";

describe("Parse integer or return undefined", () => {
    test("Should parse valid integer", async () => {
        const response = ParseUtils.parseIntOrUndefined(5);
        expect(response).toEqual(5);
    });

    test("Should parse valid integer on string format", async () => {
        const response = ParseUtils.parseIntOrUndefined("65");
        expect(response).toEqual(65);
    });

    test("Should return undefined if undefined received", async () => {
        const response = ParseUtils.parseIntOrUndefined(undefined);
        expect(response).toEqual(undefined);
    });

    test("Should return undefined if NaN received", async () => {
        const response = ParseUtils.parseIntOrUndefined("not a number");
        expect(response).toEqual(undefined);
    });

    test("Should return undefined if null received", async () => {
        const response = ParseUtils.parseIntOrUndefined(null);
        expect(response).toEqual(undefined);
    });
});

describe("Parse float or return undefined", () => {
    test("Should parse valid float", async () => {
        const response = ParseUtils.parseFloatOrUndefined(5.1);
        expect(response).toEqual(5.1);
    });

    test("Should parse valid float on string format", async () => {
        const response = ParseUtils.parseFloatOrUndefined("9.9");
        expect(response).toEqual(9.9);
    });

    test("Should return undefined if undefined received", async () => {
        const response = ParseUtils.parseFloatOrUndefined(undefined);
        expect(response).toEqual(undefined);
    });

    test("Should return undefined if NaN received", async () => {
        const response = ParseUtils.parseFloatOrUndefined("not a number");
        expect(response).toEqual(undefined);
    });

    test("Should return undefined if null received", async () => {
        const response = ParseUtils.parseFloatOrUndefined(null);
        expect(response).toEqual(undefined);
    });
});

describe("string to boolean", () => {
    test("Should return true if string is 1", () => {
        const response = ParseUtils.parseBoolean("1");
        expect(response).toEqual(true);
    });

    test("Should return true if string is true", () => {
        const response = ParseUtils.parseBoolean("true");
        expect(response).toEqual(true);
    });

    test("Should return true if string is True", () => {
        const response = ParseUtils.parseBoolean("True");
        expect(response).toEqual(true);
    });

    test("Should return false if string is 0", () => {
        const response = ParseUtils.parseBoolean("0");
        expect(response).toEqual(false);
    });

    test("Should return false if string is false", () => {
        const response = ParseUtils.parseBoolean("false");
        expect(response).toEqual(false);
    });

    test("Should return false if string is False", () => {
        const response = ParseUtils.parseBoolean("False");
        expect(response).toEqual(false);
    });

    test("Should return undefined if string is neither true or false", () => {
        const response = ParseUtils.parseBoolean("test");
        expect(response).toEqual(undefined);
    });

    test("Should return true if string is neither true or false and default value is true", () => {
        const response = ParseUtils.parseBoolean("test", true);
        expect(response).toEqual(true);
    });

    test("Should return false if string is neither true or false and default value is false", () => {
        const response = ParseUtils.parseBoolean("", false);
        expect(response).toEqual(false);
    });
});
