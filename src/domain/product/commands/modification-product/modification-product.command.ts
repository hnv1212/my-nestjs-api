export class ModificationProductCommand {
  constructor(
    readonly name: string,
    readonly sku: string,
    readonly price: number,
    readonly currency: string,
  ) {}
}
