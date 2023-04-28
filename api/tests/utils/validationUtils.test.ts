import { ValidationUtils } from "../../src/utils/validationUtils";

describe("isEmpty", () => {
    test("Should return true if string is empty", () => {
        const response = ValidationUtils.isEmpty("");
        expect(response).toEqual(true);
    });

    test("Should return true if string is undefined", () => {
        const response = ValidationUtils.isEmpty(undefined);
        expect(response).toEqual(true);
    });

    test("Should return false if string is not empty", () => {
        const response = ValidationUtils.isEmpty("undefined");
        expect(response).toEqual(false);
    });
});

describe("isNumber", () => {
    test("Should return true if string is number 1", () => {
        const response = ValidationUtils.isPositiveNumber("1");
        expect(response).toEqual(true);
    });

    test("Should return true if string is number 43243", () => {
        const response = ValidationUtils.isPositiveNumber("43243");
        expect(response).toEqual(true);
    });

    test("Should return false if string is number -40", () => {
        const response = ValidationUtils.isPositiveNumber("-40");
        expect(response).toEqual(false);
    });

    test("Should return false if string is number 0", () => {
        const response = ValidationUtils.isPositiveNumber("0");
        expect(response).toEqual(false);
    });

    test("Should return false if string starts with number but contains letters", () => {
        const response = ValidationUtils.isPositiveNumber("3fs31");
        expect(response).toEqual(false);
    });

    test("Should return false if string is literal number string", () => {
        const response = ValidationUtils.isPositiveNumber("\"432\"");
        expect(response).toEqual(false);
    });

    test("Should return false if string is empty", () => {
        const response = ValidationUtils.isPositiveNumber("");
        expect(response).toEqual(false);
    });

    test("Should return false if string is undefined", () => {
        const response = ValidationUtils.isPositiveNumber(undefined);
        expect(response).toEqual(false);
    });
});