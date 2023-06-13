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

    test("Should return true if string is null", () => {
        const response = ValidationUtils.isEmpty(null);
        expect(response).toEqual(true);
    });

    test("Should return false if string is not empty", () => {
        const response = ValidationUtils.isEmpty("undefined");
        expect(response).toEqual(false);
    });
});

describe("isAnyStringEmpty", () => {
    test("Should return true if any string is empty", () => {
        const response = ValidationUtils.isAnyStringEmpty("", "test");
        expect(response).toEqual(true);
    });

    test("Should return true if any string is undefined", () => {
        const response = ValidationUtils.isAnyStringEmpty(undefined, "test");
        expect(response).toEqual(true);
    });

    test("Should return true if any string is null", () => {
        const response = ValidationUtils.isAnyStringEmpty(null, "test");
        expect(response).toEqual(true);
    });

    test("Should return false if no string is empty", () => {
        const response = ValidationUtils.isAnyStringEmpty("test", "test");
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
        const response = ValidationUtils.isPositiveNumber('"432"');
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

describe("isValidEmail", () => {
    test("Should return true if string is email", () => {
        const response = ValidationUtils.isValidEmail("email@email.com");
        expect(response).toEqual(true);
    });

    test("Should return false if string does not have @", () => {
        const response = ValidationUtils.isValidEmail("emailemail.com");
        expect(response).toEqual(false);
    });

    test("Should return false if there is nothing before @", () => {
        const response = ValidationUtils.isValidEmail("@emailemail.com");
        expect(response).toEqual(false);
    });

    test("Should return false if string does not have .", () => {
        const response = ValidationUtils.isValidEmail("email@emailemailcom");
        expect(response).toEqual(false);
    });

    test("Should return false if there is nothing after .", () => {
        const response = ValidationUtils.isValidEmail("email@emailemail.");
        expect(response).toEqual(false);
    });

    test("Should return false if string is empty", () => {
        const response = ValidationUtils.isValidEmail("");
        expect(response).toEqual(false);
    });

    test("Should return false if string is undefined", () => {
        const response = ValidationUtils.isValidEmail(undefined);
        expect(response).toEqual(false);
    });
});
