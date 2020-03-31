import { Item, Component } from "./Items";

/**
 * An object that observes the belt and is notified about certain events.
 */
export interface Observer {
    /**
     * Called when a component enters the first slot on the belt.
     * @param component The component, or null if an empty slot entered.
     */
    notifyComponentEnteredBelt(component?: Component): void;

    /**
     * Called when an item leaves the last slot on the belt.
     * @param item The item, or null if an empty slot exited.
     */
    notifyItemExitedBelt(item?: Item): void;
}