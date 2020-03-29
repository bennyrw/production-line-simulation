/**
 * An item that can be stored in a conveyer belt slot or held by a worker.
 */
export interface Item {
}

/**
 * A component that can be made into a product.
 */
export class Component implements Item {
    /**
     * The type of the component.
     */
    type: string
}

/**
 * A finished product.
 */
export class Product implements Item {
}