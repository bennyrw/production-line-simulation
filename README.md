# Background
See the [requirements](requirements.md)

# Usage
```
npm i
npm run build
node dist/app.js           # run with default simulation parameters
node dist/app.js -h        # show usage
```

# Tests
```
npm i
npm run test
```

# Design
I modelled this problem using the following classes/types:

```
      --------
      | Belt |
      --------
          |
          |
          | 1..*
      --------            0..1 --------
      | Slot |---------------- | Item |
      --------                 --------
          |              0..2 /  ^    ^
          |          ---------   |    |
          | 0..*    /            |  -----------
     ----------    /             |  | Product |
     | Worker |---/              |  -----------
     ----------                  |
                           -------------
                           | Component |
                           -------------
```

# Assumptions
* That I had freedom to choose the programming language and tooling. I decided to use TypeScript so I could use type-safe object-oriented programming principles. I decided to use Node to provide a command-line interface as I thought it would be interesting to easily simulate different scenarios by changing input varibles.

# Examples of built-in flexibility
* Avoided placing hard limits on number of slots and workers per slots. These are just collections of arbitrary size.
* Component types are strings, e.g. 'A' and 'B' and more component types can easily be added in future.
* Components that are generated at the start of the conveyer belt can be defined using an array (equal probility for each element currently).
* Workers can have different build durations. Currently they all get the same but this could be easily extended to allow workers to vary speeds e.g. by skill level.
* Observer interface allows additional data/events to be logged easily and cleanly.

# Potential future extensions
* When generating items at the start of the belt, it would be interesting to allow a probability distribution to be specified for items (or empty slots), rather than each item being equally probable.
* Support making different types of products from different components.
  * Assuming workers can still only hold two items, with lots of different component types it might be most efficient to have them know what products include the components that they've already got and then see if any needed components are coming down the conveyer belt to them (at the risk of another worker taking it before it gets to them). Workers might want to place an unusued component back on the belt if they see other workers before them are busy and products could be built with what is coming their way on the belt.
  * Certain products might need workers to have a certain skill level/qualification in order to build them.