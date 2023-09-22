import { AggregateRoot } from "@nestjs/cqrs";
import { ProductWasAddedEvent } from "../events/product-was-added/product-was-added.event";

export class ProductAggregate extends AggregateRoot {
    constructor(private readonly sku: string) {
        super()
    }

    registerProduct(sku: string, name: string, price: number, currency: string) {
        this.apply(new ProductWasAddedEvent(name, sku, price, currency))
    }
}