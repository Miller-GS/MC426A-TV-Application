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