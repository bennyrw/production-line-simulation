import { Belt } from "../src/Belt";
import { Worker } from "../src/Worker";

describe("Conveyer belt", () => {
    it("Advancing items works but workers stay where they are", () => {
        const initialSlotStates = [
            {numWorkers: 2, item: 'A'},
            {numWorkers: 2, item: null},
            {numWorkers: 2, item: 'B'},
        ];
        const possibleItems = ['A', 'B', null];
        const belt = new Belt(initialSlotStates, possibleItems);

        expect(belt.slots.length).toBe(3);

        const workersBefore: Worker[] = [];
        belt.slots.forEach(slot => workersBefore.push(...slot.workers));

        expect(belt.slots[0].item).toBe('A');
        expect(belt.slots[1].item).toBe(null);
        expect(belt.slots[2].item).toBe('B');

        // advance for the first time
        belt.advanceSlotItems();

        expect(belt.slots.length).toBe(3);
        expect(belt.slots[0].item).toBeDefined(); // might be null, A or B
        expect(belt.slots[1].item).toBe('A');
        expect(belt.slots[2].item).toBe(null);

        // advance a second time
        const firstNewItem = belt.slots[0].item;
        belt.advanceSlotItems();

        expect(belt.slots.length).toBe(3);
        expect(belt.slots[0].item).toBeDefined();
        expect(belt.slots[1].item).toBe(firstNewItem);
        expect(belt.slots[2].item).toBe('A');

        // advance a third time
        const secondNewItem = belt.slots[0].item;
        belt.advanceSlotItems();

        expect(belt.slots.length).toBe(3);
        expect(belt.slots[0].item).toBeDefined();
        expect(belt.slots[1].item).toBe(secondNewItem);
        expect(belt.slots[2].item).toBe(firstNewItem);

        // we're expecting the workers to have stayed where they are and not to have moved too!
        const workersAfter: Worker[] = [];
        belt.slots.forEach(slot => workersAfter.push(...slot.workers));
        expect(workersBefore.length).toEqual(workersAfter.length);
        for (let i = 0; i < workersBefore.length; i++) {
            expect(workersBefore[i]).toBe(workersAfter[i]);
        }
    });

    it("Advancing items eventually generates one of every component type", () => {
        const componentsSeen = new Set();

        const initialSlotStates = [
            {numWorkers: 2},
            {numWorkers: 2},
            {numWorkers: 2},
        ];
        const possibleItems = ['A', 'B', null];
        const belt = new Belt(initialSlotStates, possibleItems);

        const slotItemsSeen = new Set();
        // 100 goes should be enough for 2 items + null to all have occurred!
        for (let i = 0; i < 100; ++i) {
            belt.advanceSlotItems();
            slotItemsSeen.add(belt.slots[0].item);
        }

        // using set as order doesn't matter
        expect(slotItemsSeen).toEqual(new Set(possibleItems));
    });
});
