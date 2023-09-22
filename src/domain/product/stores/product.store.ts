import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductStore {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepo: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepo.find();
  }

  async getBySku(sku: string): Promise<Product> {
    return await this.productRepo.findOne({ where: { sku } });
  }

  async register(
    productEntity: Product,
    sku?: string,
  ): Promise<Product | Error> {
    if (sku) {
      return await this.update(productEntity, sku);
    } else {
      return await this.create(productEntity);
    }
  }

  private async create(productEntity: Product): Promise<Product | Error> {
    try {
      const product = this.productRepo.create(productEntity);
      return await this.productRepo.save(product);
    } catch (e) {
      return new Error(e);
    }
  }

  private async update(
    productEntity: Product,
    sku: string,
  ): Promise<Product | Error> {
    try {
      await this.productRepo.update({ sku }, productEntity);
      return this.productRepo.findOne({ where: { sku } });
    } catch (e) {
      return new Error(e);
    }
  }

  async removeProduct(sku: string): Promise<Product | Error> {
    try {
      const product = this.productRepo.findOne({ where: { sku } });
      await this.productRepo.delete({ sku });

      return product;
    } catch (e) {
      return new Error(e);
    }
  }
}
