export class RegisterProductCommand {
  public constructor(
    readonly name: string,
    readonly sku: string,
    readonly price: number,
    readonly currency: string,
  ) {}
}
