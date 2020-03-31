import * as yargs from "yargs";

// parse simulation parameters from command-line if given
const argv = yargs
    .option("buildDuration", {
        description: "Number of time units that a worker builds for",
        type: "number",
    })
    .option("numSlots", {
        type: "number",
    })
    .option("numWorkersPerSlot", {
        type: "number",
    })
    .option("simulationLength", {
        description: "Number of time units to simulate for",
        type: "number",
    })
    .help()
    .alias("help", "h")
    .argv;

// set paramerers from command-line, or use defaults if not provided or input invalid
const useValueIfValidNumber = (value: any, minValue: number, defaultValue: number) => typeof value === "number" && value >= minValue ? value : defaultValue;
const buildDuration = useValueIfValidNumber(argv.buildDuration, 1, 4);
const numSlots = useValueIfValidNumber(argv.numSlots, 1, 3);
const numWorkersPerSlot = useValueIfValidNumber(argv.numWorkersPerSlot, 0, 2);
const simulationLength = useValueIfValidNumber(argv.simulationLength, 0, 100);

export default {
    buildDuration,
    numSlots,
    numWorkersPerSlot,
    simulationLength
};