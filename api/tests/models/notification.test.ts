import { NotificationParser } from "../../src/models/notification";

describe("parseNotification", () => {
    test("Should return read false from empty object", () => {
        const obj = {};
        const notification = NotificationParser.parseNotification(obj);

        expect(notification).toEqual({ read: false });
    });

    test("Should return empty notification from undefined object", () => {
        const obj = undefined;
        const notification = NotificationParser.parseNotification(obj);

        expect(notification).toEqual({});
    });

    test("Should return read as true from object with ReadAt attribute", () => {
        const obj = { ReadAt: new Date() };
        const notification = NotificationParser.parseNotification(obj);

        expect(notification).toEqual({ read: true });
    });
});
