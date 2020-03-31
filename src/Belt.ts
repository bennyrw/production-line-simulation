import { Slot } from "./Slot";
import { Item, Component } from "./Items";
import { Worker } from "./Worker";
import { Observer } from "./Observer";

/**
 * The conveyer belt, made up of multiple slots.
 */
export class Belt {
    /**
     * The slots in this belt.
     */
    slots: Slot[] = [];
    /**
     * The components that can be generated at the start of this conveyer belt, which may include null if the start of the belt can become empty.
     */
    possibleComponents: Component[]
    /**
     * Callback when an item reaches the end of the belt. e.g. can be used for logging.
     */
    observer: Observer;

    constructor(slots: Slot[], possibleComponents: Component[], observer?: Observer) {
        this.slots = slots;
        this.possibleComponents = possibleComponents;
        this.observer = observer;
    }

    /**
     * Advance the items in the slots by one step, potentially adding a newly generated component in the first slot.
     */
    advanceSlotItems(): void {
        const numSlots = this.slots.length;
        if (this.observer) {
            this.observer.notifyItemExitedBelt(this.slots[numSlots - 1].item);
        }

        for (let i = numSlots - 1; i > 0; i--) {
            this.slots[i].item = this.slots[i - 1].item;
        }

        this.slots[0].item = this.generateNewComponent();
        if (this.observer) {
            this.observer.notifyComponentEnteredBelt(this.slots[0].item as Component);
        }
    }

    /**
     * Generate a new component at the start of the conveyer belt. Currently this randomly generates one component from those possible with equal probability.
     */
    private generateNewComponent(): Component {
        const index = Math.floor(Math.random() * this.possibleComponents.length);
        const componentTemplate = this.possibleComponents[index];
        // return a new copy of the template
        return componentTemplate ? componentTemplate.clone() : null;
    }
}