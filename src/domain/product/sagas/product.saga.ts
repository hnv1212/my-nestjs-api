import { Injectable, Logger } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, delay, map } from 'rxjs';
import { ProductWasAddedEvent } from '../events/product-was-added/product-was-added.event';
import { AddProductToCatalogCommand } from 'src/domain/catalog/commands/add-product-to-catalog/add-product-to-catalog.command';

@Injectable()
export class ProductSaga {
  @Saga()
  productWasAdded = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ProductWasAddedEvent),
      delay(1000),
      map((event) => {
        Logger.log('saga call AAddProductToCatalogCommand');
        return new AddProductToCatalogCommand(
          event.sku,
          event.name,
          event.price,
          event.currency,
        );
      }),
    );
  };
}
