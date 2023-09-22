import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProductStore } from "../../stores/product.store";
import { GetAllProductsQuery } from "./get-all-products.query";

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler implements IQueryHandler<GetAllProductsQuery> {
    constructor(private readonly productStore: ProductStore) {}
    
    async execute(query: GetAllProductsQuery): Promise<any> {
        return await this.productStore.getAllProducts()
    }
}