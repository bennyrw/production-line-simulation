import { Item, Component, Product } from "./Items";
import { Slot } from "./Slot";

/**
 * A worker on the conveyer belt.
 */
export class Worker {
    private static readonly MAX_ITEMS_HELD = 2;

    /**
     * The time it takes this worker to build a product.
     */
    buildDuration: number;
    /**
     * The items the worker is holding/working on, if any. May be empty but never null/undefined.
     * If the worker has finished building this will contain a single Product item.
     */
    items: Item[] = [];
    /**
     * null if the worker isn't currently building, otherwise the number of time units until they finish building
     */
    buildTimeRemaining: number | null;

    constructor(buildDuration: number) {
        this.buildDuration = buildDuration;
    }

    isBuilding(): boolean {
        return typeof this.buildTimeRemaining === "number" && this.buildTimeRemaining > 0;
    }

    isHoldingFinishedProduct(): boolean {
        return this.items.length === 1 && this.items[0] instanceof Product;
    }

    isHoldingComponentType(componentType: string) {
        return Boolean(this.items.find(item => {
            if (item instanceof Component) {
                return componentType === (item as Component).componentType;
            }
            return false;
        }));
    }

    /**
     * Whether the worker can take the specified component - i.e. if the worker isn't currently building, isn't holding a finished product and waiting to put that
     * on the belt, has room to take another component and isn't already holding the same type of component.
     * @param component The component.
     */
    canTake(component: Component): boolean {
        return !this.isBuilding()
            && !this.isHoldingFinishedProduct()
            && this.items.length < Worker.MAX_ITEMS_HELD
            && !this.isHoldingComponentType(component.componentType);
    }

    /**
     * Whether the specified component would allow the worker to start building.
     * @param component The component.
     */
    couldStartBuildingWith(component: Component): boolean {
        // simple implementation with two component types - just check they're already holding something and that they can take
        // this new component (see canTake() above)
        return this.canTake(component)
            && this.items.length > 0;
    }

    /**
     * Place a finished product onto the slot. The worker must have finished building.
     * @param slot The slot to place the product onto. Must be empty.
     */
    placeFinishedProduct(slot: Slot): void {
        if (slot.item) {
            throw new Error("Can't place item into non-empty slot");
        }
        if (!this.isHoldingFinishedProduct()) {
            throw new Error("Can't place a non-finished product back on the slot");
        }

        slot.item = this.items[0];
        this.items = [];
        this.buildTimeRemaining = null;
    }

    /**
     * Take a component from the slot.
     * @param slot The slot to take from. Must contain a component.
     */
    takeComponent(slot: Slot) {
        if (!slot.hasComponent()) {
            throw new Error("Can only take components");
        }
        if (!this.canTake(slot.item as Component)) {
            throw new Error("Can't take a component when don't need it or don't have space for it");
        }

        const canStartBuilding = this.couldStartBuildingWith(slot.item as Component);

        this.items.push(slot.item);
        slot.item = null;

        if (canStartBuilding) {
            this.buildTimeRemaining = this.buildDuration;
        }
    }

    /**
     * If the worker is busy building a product, continue for a time unit
     */
    continueBuilding(): void {
        if (!this.isBuilding()) {
            throw new Error("Not currently building");
        }

        --this.buildTimeRemaining;

        if (!this.isBuilding()) {
            // finished! replace the components this worker holds with a new product
            this.items = [new Product()];
        }
    }
}
