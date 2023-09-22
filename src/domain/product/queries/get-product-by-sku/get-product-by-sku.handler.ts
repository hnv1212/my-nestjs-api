import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductBySkuQuery } from './get-product-by-sku.query';
import { ProductStore } from '../../stores/product.store';

@QueryHandler(GetProductBySkuQuery)
export class GetProducyBySkuHandler
  implements IQueryHandler<GetProductBySkuQuery>
{
  constructor(private readonly productStore: ProductStore) {}

  async execute(query: GetProductBySkuQuery): Promise<any> {
    try {
      const { sku } = query;
      const product = this.productStore.getBySku(sku);
      if (product instanceof Error) throw product;

      return product;
    } catch (e) {
      return new Error(e);
    }
  }
}
