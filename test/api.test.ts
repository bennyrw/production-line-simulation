import {sayHello} from "../src/app";

describe("greeting", () => {
    it("should say hello", () => {
        expect(sayHello()).toEqual("Hello");
    });
});
