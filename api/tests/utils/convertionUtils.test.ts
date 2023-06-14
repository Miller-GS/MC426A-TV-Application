import { ConvertionUtils } from "../../src/utils/convertionUtils";

describe("string to boolean", () => {
    test("Should return true if string is 1", () => {
        const response = ConvertionUtils.stringToBoolean("1");
        expect(response).toEqual(true);
    });

    test("Should return true if string is true", () => {
        const response = ConvertionUtils.stringToBoolean("true");
        expect(response).toEqual(true);
    });

    test("Should return true if string is True", () => {
        const response = ConvertionUtils.stringToBoolean("True");
        expect(response).toEqual(true);
    });

    test("Should return false if string is 0", () => {
        const response = ConvertionUtils.stringToBoolean("0");
        expect(response).toEqual(false);
    });

    test("Should return false if string is false", () => {
        const response = ConvertionUtils.stringToBoolean("false");
        expect(response).toEqual(false);
    });

    test("Should return false if string is False", () => {
        const response = ConvertionUtils.stringToBoolean("False");
        expect(response).toEqual(false);
    });

    test("Should return undefined if string is neither true or false", () => {
        const response = ConvertionUtils.stringToBoolean("test");
        expect(response).toEqual(undefined);
    });

    test("Should return true if string is neither true or false and default value is true", () => {
        const response = ConvertionUtils.stringToBoolean("test", true);
        expect(response).toEqual(true);
    });

    test("Should return false if string is neither true or false and default value is false", () => {
        const response = ConvertionUtils.stringToBoolean("", false);
        expect(response).toEqual(false);
    });
});
