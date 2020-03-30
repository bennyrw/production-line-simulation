import { Belt } from "../src/Belt";
import { Worker } from "../src/Worker";
import { Component } from "../src/Items";
import { Slot } from "../src/Slot";

describe("Conveyer belt", () => {
    let belt: Belt;

    beforeEach(() => {
        const slots = [
            {numWorkers: 2, item: new Component("A")},
            {numWorkers: 2, item: null},
            {numWorkers: 2, item: new Component("B")},
        ].map(info => {
            const buildDuration = 4;
            const workers = [...Array(info.numWorkers)].map(i => new Worker(buildDuration));
            return new Slot(workers, info.item);
        });
        const possibleComponents = [new Component("A"), new Component("B"), null];

        belt = new Belt(slots, possibleComponents);
    });

    it("Advancing items works but workers stay where they are", () => {
        expect(belt.slots.length).toBe(3);

        // keep track of the order of the workers
        const workersBefore: Worker[][] = [];
        belt.slots.forEach(slot => workersBefore.push(slot.workers));

        expect(belt.slots[0].item).toEqual(new Component("A"));
        expect(belt.slots[1].item).toBe(null);
        expect(belt.slots[2].item).toEqual(new Component("B"));

        // advance for the first time
        belt.advanceSlotItems();

        expect(belt.slots.length).toBe(3);
        expect(belt.slots[0].item).toBeDefined(); // might be null, A or B
        expect(belt.slots[1].item).toEqual(new Component("A"));
        expect(belt.slots[2].item).toBe(null);

        // advance a second time
        const firstNewItem = belt.slots[0].item;
        belt.advanceSlotItems();

        expect(belt.slots.length).toBe(3);
        expect(belt.slots[0].item).toBeDefined();
        expect(belt.slots[1].item).toBe(firstNewItem);
        expect(belt.slots[2].item).toEqual(new Component("A"));

        // advance a third time
        const secondNewItem = belt.slots[0].item;
        belt.advanceSlotItems();

        expect(belt.slots.length).toBe(3);
        expect(belt.slots[0].item).toBeDefined();
        expect(belt.slots[1].item).toBe(secondNewItem);
        expect(belt.slots[2].item).toBe(firstNewItem);

        // we're expecting the workers to have stayed where they are and not to have moved too!
        const workersAfter: Worker[][] = [];
        belt.slots.forEach(slot => workersAfter.push(slot.workers));
        for (let i = 0; i < workersBefore.length; i++) {
            // use toBe() as they should be the same object
            expect(workersAfter[0]).toBe(workersBefore[0]);
            expect(workersAfter[1]).toBe(workersBefore[1]);
        }
    });

    it("Advancing items eventually generates one of every component type", () => {
        const componentsGenerated: Component[] = [];
        // 100 goes should be enough for 2 items + null to all have occurred!
        for (let i = 0; i < 100; ++i) {
            belt.advanceSlotItems();
            componentsGenerated.push(belt.slots[0].item as Component);
        }

        expect(componentsGenerated.find(c => c && c.componentType === "A")).not.toBeNull();
        expect(componentsGenerated.find(c => c && c.componentType === "B")).not.toBeNull();
        expect(componentsGenerated.indexOf(null)).toBeGreaterThanOrEqual(0);
    });
});
