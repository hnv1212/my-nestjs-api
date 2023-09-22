import { Logger } from '@nestjs/common';

export class ProductWasAddedEvent {
  constructor(
    readonly name: string,
    readonly sku: string,
    readonly price: number,
    readonly currency: string,
  ) {
    Logger.log('ProductWasAddedEvent called');
  }
}
