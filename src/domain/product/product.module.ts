import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ModificationProductCommand } from './commands/modification-product/modification-product.command';
import { RegisterProductCommand } from './commands/register-product/register-product.command';
import { RemoveProductCommand } from './commands/remove-product/remove-product.command';
import { ProductWasAddedEvent } from './events/product-was-added/product-was-added.event';
import { ProductStore } from './stores/product.store';
import { GetAllProductsQuery } from './queries/get-all-products/get-all-products.query';
import { GetProductBySkuQuery } from './queries/get-product-by-sku/get-product-by-sku.query';
import { ProductSaga } from './sagas/product.saga';

const CommandHandlers = [
  ModificationProductCommand,
  RegisterProductCommand,
  RemoveProductCommand,
];
const Events = [ProductWasAddedEvent]
const QueryHandler = [
    GetAllProductsQuery,
    GetProductBySkuQuery,
]

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [ProductService, ...CommandHandlers, ...Events, ProductStore, ...QueryHandler, ProductSaga],
})
export class ProductModule {}
