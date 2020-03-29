import { Slot, SlotDefinition } from "./Slot"
import { Item } from "./Items";

/**
 * The conveyer belt, made up of multiple slots.
 */
export class Belt {
    /**
     * The slots in this belt.
     */
    slots: Slot[] = [];
    /**
     * The items that can be generated at the start of this conveyer belt, which may include null if the start of the belt can become empty.
     */
    possibleItems: Item[];

    constructor(initialSlotStates: SlotDefinition[], possibleItems: Item[]) {
        this.slots = initialSlotStates.map(state => new Slot(state));
        this.possibleItems = possibleItems;
    }

    /**
     * Advance the items in the slots by one step, potentially adding a newly generated item in the first slot.
     */
    advanceSlotItems(): void {
        for (let i = this.slots.length -1; i > 0; i--) {
            this.slots[i].item = this.slots[i - 1].item;
        }

        this.slots[0].item = this.generateNewItem();
    }

    /**
     * Generate a new item at the start of the conveyer belt. Currently this randomly generates one item from possibleItems with equal probability.
     */
    private generateNewItem(): Item {
        const index = Math.floor(Math.random() * this.possibleItems.length);
        return this.possibleItems[index];
    }
}