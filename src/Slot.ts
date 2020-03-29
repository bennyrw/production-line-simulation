import { Item } from "./Items";
import { Worker } from "./Worker";

/**
 * Type used to create a new slot.
 */
export type SlotDefinition = {
    numWorkers: number;
    item?: Item;
}

/**
 * A slot in on the conveyer belt, which may contain an item and may have workers working at it.
 */
export class Slot {
    /**
     * The workers associated with this slot.
     */
    workers: Worker[] = [];
    /**
     * The item at this slot, if there is one.
     */
    item?: Item;

    constructor(state: SlotDefinition) {
        for (let i = 0; i < state.numWorkers; i++) {
            this.workers.push(new Worker());
        }
        this.item = state.item;
    }   
}
