import { Slot } from "../src/Slot";
import { Worker } from "../src/Worker";
import { Component, Product } from "../src/Items";

describe("Slot", () => {
    let slot: Slot;
    let worker1: Worker;
    let worker2: Worker;

    beforeEach(() => {
        const buildDuration = 3;
        worker1 = new Worker(buildDuration);
        worker2 = new Worker(buildDuration);
        const workers = [worker1, worker2];

        const item = new Component("A");

        slot = new Slot(workers, item);
    });

    it("A worker takes a component if no workers are holding anything", () => {
        slot.doWork();

        // gone from the slot
        expect(slot.item).toBeNull();

        if (worker1.items.length > 0) {
            // first worker took it
            expect(worker1.items[0]).toEqual(new Component("A"));
            expect(worker2.items.length).toBe(0);
        } else {
            // second worker took it
            expect(worker1.items.length).toBe(0);
            expect(worker2.items[0]).toEqual(new Component("A"));
        }
    });

    it("A worker takes a component if it allows them to start building", () => {
        // worker 2 already has a 'B' so they should get the 'A' as a priority rather than empty-handed worker 1 who can't do anything with the component yet
        expect(worker2.items.length).toBe(0);
        worker2.items[0] = new Component("B");

        slot.doWork();

        // gone from the slot
        expect(slot.item).toBeNull();

        expect(worker1.items.length).toBe(0);
        expect(worker2.items.length).toBe(2);
        // and they should now be busy
        expect(worker2.buildTimeRemaining).toBeGreaterThan(0);
    });

    it("Workers leave components while they are busy building", () => {
        // worker 1 needs an 'A' and worker 2 needs a 'B'
        worker1.items[0] = new Component("B");
        worker2.items[0] = new Component("A");

        slot.doWork();

        slot.item = new Component("B");
        slot.doWork();

        // both should now be busy (worker 1 should be busy for 2 time units and worker 2 for 3 time units)
        expect(worker1.isBuilding()).toBe(true);
        expect(worker2.isBuilding()).toBe(true);

        // any further item types shouldn't be taken until someone has finished building
        slot.item = new Component("B");
        slot.doWork();
        expect(slot.item).toEqual(new Component("B"));

        slot.item = new Component("A");
        slot.doWork();
        expect(slot.item).toEqual(new Component("A"));

        // worker 1 should have finished now and be holding their finished product
        expect(worker1.isBuilding()).toBe(false);
        expect(worker1.items.length).toBe(1);
        expect(worker1.items[0] instanceof Product).toBe(true);

        expect(worker2.isBuilding()).toBe(true);
    });

    it("When a worker finishes building, they can place a product on an empty belt", () => {
        const product = new Product();
        worker1.items[0] = product;
        slot.item = null;

        slot.doWork();

        expect(worker1.items.length).toBe(0);
        expect(slot.item).toBe(product);
    });

    it("When a worker finishes building, they hold onto the product if the belt is not empty", () => {
        const product1 = new Product();
        worker1.items = [product1];
        const product2 = new Product();
        worker2.items = [product2];

        slot.doWork();

        expect(worker1.items).toEqual([product1]);
        expect(worker2.items).toEqual([product2]);
        expect(slot.item).toEqual(new Component("A"));
    });

    it("When a worker finishes building, they hold onto the product if another worker has taken an item in the same time unit", () => {
        const product = new Product();
        worker1.items[0] = product;

        expect(slot.item).toEqual(new Component("A"));
        expect(worker1.items).toEqual([product]);
        expect(worker2.items).toEqual([]);

        slot.doWork();

        expect(slot.item).toBeNull();
        expect(worker1.items).toEqual([product]);
        expect(worker2.items).toEqual([new Component("A")]);
    });
});
