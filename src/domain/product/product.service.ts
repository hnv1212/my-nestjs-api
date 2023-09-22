import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Product } from './entities/product.entity';
import { RegisterProductCommand } from './commands/register-product/register-product.command';
import { ModificationProductCommand } from './commands/modification-product/modification-product.command';
import { RemoveProductCommand } from './commands/remove-product/remove-product.command';
import { GetAllProductsQuery } from './queries/get-all-products/get-all-products.query';
import { GetProductBySkuQuery } from './queries/get-product-by-sku/get-product-by-sku.query';

@Injectable()
export class ProductService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async productRegistration(
    name: string,
    sku: string,
    price: number,
    currency: string,
  ): Promise<Product | Error> {
    return this.commandBus.execute(
      new RegisterProductCommand(name, sku, price, currency),
    );
  }

  public async productModification(
    name: string,
    sku: string,
    price: number,
    currency: string,
  ): Promise<Product | Error> {
    return this.commandBus.execute(
      new ModificationProductCommand(name, sku, price, currency),
    );
  }

  async removeProduct(sku: string): Promise<Product | Error> {
    return this.commandBus.execute(new RemoveProductCommand(sku));
  }

  async getAll(): Promise<Product[]> {
    return this.queryBus.execute(new GetAllProductsQuery());
  }

  async getBySku(sku: string): Promise<Product> {
    return this.queryBus.execute(new GetProductBySkuQuery(sku));
  }
}
