import { Belt } from "./Belt";
import { Item, Component, Product } from "./Items";
import { Slot } from "./Slot";
import { Worker } from "./Worker";
import { Observer } from "./Observer";
import config from "./config/config";
  
const possibleComponents = [
    new Component("A"),
    new Component("B"),
    null,
];

// for now just create all identical workers, but this could be enhanced to allow
// workers of different types/build speeds in the future
const slots = [...Array(config.numSlots)].map(s => {
    const workers = [...Array(config.numWorkersPerSlot)].map(w => new Worker(config.buildDuration));
    return new Slot(workers);
});

class StatsRecorder implements Observer {
    componentTypesEntered = new Map<string, number>();
    numFinishedProductsExited = 0;
    componentTypesExited = new Map<string, number>();

    notifyComponentEnteredBelt(component?: Component): void {
        if (component) {
            let count = this.componentTypesEntered.get(component.componentType) || 0;
            this.componentTypesEntered.set(component.componentType, ++count);
        }
    }

    notifyItemExitedBelt(item?: Item): void {
        if (item) {
            if (item instanceof Product) {
                ++this.numFinishedProductsExited;
            } else {
                const component = item as Component;
                let count = this.componentTypesExited.get(component.componentType) || 0;
                this.componentTypesExited.set(component.componentType, ++count);
            }
        }
    }   

    printSummary(): void {
        console.log(`Using a ${config.numSlots} slot conveyer belt, ${config.numWorkersPerSlot} workers per slot and ${config.buildDuration} time unit build duration.`);
        console.log(`After ${config.simulationLength} time units:`);
        this.componentTypesEntered.forEach((count, componentType) => {
            console.log(`  ${count} x Component ${componentType} entered the belt`);
        });
        console.log(`  ${this.numFinishedProductsExited} x finished products exited the belt`);
        this.componentTypesExited.forEach((count, componentType) => {
            console.log(`  ${count} x Component ${componentType} exited the belt`);
        });
    }
}

const stats = new StatsRecorder();
const belt = new Belt(slots, possibleComponents, stats);

for (let i = 0; i < config.simulationLength; i++) {
    belt.advanceSlotItems();
    belt.slots.forEach(slot => {
        slot.doWork();
    });
}

stats.printSummary();