import { Item, Component } from "./Items";
import { Worker } from "./Worker";

/**
 * A slot on the conveyer belt, which may contain an item and may have workers working at it.
 */
export class Slot {
    /**
     * The workers associated with this slot.
     */
    workers: Worker[] = [];
    /**
     * The item at this slot, if there is one.
     */
    item?: Item = null;

    constructor(workers: Worker[], item: Item = null) {
        this.workers = workers;
        this.item = item;
    } 

    /**
     * Cause the workers associated with this slot to do one time-unit's worth of work, which might involve them waiting, building or interacting with the slot.
     */
    doWork(): void {
        const workersWhoAreBuilding = this.workers.filter(worker => worker.isBuilding());
        const idleWorkers = this.workers.filter(worker => !worker.isBuilding());

        // let all workers who are building continue
        workersWhoAreBuilding.forEach(worker => worker.continueBuilding());

        // let all the idle workers interact with the belt
        if (this.isEmpty()) {
            // slot is empty, so we'll put a finished product down if we can
            const workerWhoHasFinished = idleWorkers.find(worker => worker.isHoldingFinishedProduct());
            if (workerWhoHasFinished && this.isEmpty()) {
                workerWhoHasFinished.placeFinishedProduct(this);
                // nothing more this time unit
                return;
            }
        } else if (this.hasComponent()) {
            // slot has a component - prioritise workers who could start building immediately
            const workerWhoCanBuild = idleWorkers.find(worker => worker.couldStartBuildingWith(this.item as Component));
            if (workerWhoCanBuild) {
                workerWhoCanBuild.takeComponent(this);
                // nothing more this time unit
                return;
            }

            // next, prioritise anyone who hasn't got the component
            const workerWhoNeedsComponent = idleWorkers.find(worker => worker.canTake(this.item as Component));
            if (workerWhoNeedsComponent) {
                workerWhoNeedsComponent.takeComponent(this);
                // nothing more this time unit
                return;
            }

            // can't do anything this time unit then
        }
    }

    isEmpty(): boolean {
        return !Boolean(this.item);
    }

    hasComponent(): boolean {
        return this.item instanceof Component;
    }
}
