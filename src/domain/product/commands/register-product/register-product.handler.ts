import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RegisterProductCommand } from "./register-product.command";
import { ProductStore } from "../../stores/product.store";
import { Product } from "../../entities/product.entity";
import { Logger } from "@nestjs/common";
import { ProductAggregate } from "../../aggregates/product.aggregate";

@CommandHandler(RegisterProductCommand)
export class RegisterProductHandler implements ICommandHandler<RegisterProductCommand> {
    constructor(
        private readonly productStore: ProductStore,
        private readonly publisher: EventPublisher
    ) {}

    async execute(command: RegisterProductCommand): Promise<Product | Error> {
        try {
           const { name, sku, price, currency} = command 
           const productEntity = new Product()
           productEntity.name = name
           productEntity.sku = sku
           productEntity.price = price
           productEntity.currency = currency
           
           const product = await this.productStore.register(productEntity)
           if(product instanceof Error) {
            throw product
           }

           const productAggregate =this.publisher.mergeObjectContext(await new ProductAggregate(sku))
           productAggregate.registerProduct(sku, name, price, currency)
           productAggregate.commit()

           return product
        } catch (e) {
            Logger.error(e, 'RegisterProductHandler.execute() Error Handler: ')
            return e
        }
    }
}