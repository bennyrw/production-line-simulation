/**
 * An item that can be stored in a conveyer belt slot or held by a worker.
 */
export type Item = Component | Product;

/**
 * A component that can be made into a product.
 */
export class Component {
    /**
     * The type of the component.
     */
    componentType: string

    constructor(componentType: string) {
        this.componentType = componentType;
    }

    clone(): Component {
        return new Component(this.componentType);
    }
}

/**
 * A finished product.
 */
export class Product {
    /**
     * The type of the product.
     */
    productType: string;
}