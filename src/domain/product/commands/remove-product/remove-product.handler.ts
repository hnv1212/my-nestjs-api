import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProductCommand } from './remove-product.command';
import { ProductStore } from '../../stores/product.store';
import { Logger } from '@nestjs/common';

@CommandHandler(RemoveProductCommand)
export class RemoveProductHandler
  implements ICommandHandler<RemoveProductCommand>
{
  constructor(private readonly productStore: ProductStore) {}

  execute(command: RemoveProductCommand): Promise<any> {
    try {
      const { sku } = command;
      const product = this.productStore.removeProduct(sku);
      if (product instanceof Error) {
        throw product;
      }

      return product;
    } catch (e) {
      Logger.error(e, 'RemoveProductHandler.execute() error');
      return e;
    }
  }
}
