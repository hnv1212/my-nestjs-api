import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CatalogStore } from './stores/catalog.store';
import { CatalogProvider } from './providers/catalog.provider';
import { AddProductToCatalogHandler } from './commands/add-product-to-catalog/add-product-to-catalog.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, DatabaseModule],
  providers: [CatalogStore, ...CatalogProvider, AddProductToCatalogHandler],
})
export class CatalogModule {}
