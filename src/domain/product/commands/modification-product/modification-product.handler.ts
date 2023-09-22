import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ModificationProductCommand } from './modification-product.command';
import { ProductStore } from '../../stores/product.store';
import { Product } from '../../entities/product.entity';

@CommandHandler(ModificationProductCommand)
export class ModificationProductHandler
  implements ICommandHandler<ModificationProductCommand>
{
  constructor(private readonly productStore: ProductStore) {}

  async execute(command: ModificationProductCommand): Promise<any> {
    try {
      const { sku, name, price, currency } = command;
      const productEntity = new Product();
      productEntity.sku = sku;
      productEntity.name = name;
      productEntity.price = price;
      productEntity.currency = currency;

      const product = this.productStore.register(productEntity, sku);
      if (product instanceof Error) {
        throw product;
      }
      return product;
    } catch (e) {
      return new Error(e);
    }
  }
}
