import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Catalog } from '../entities/catalog.entity';

@Injectable()
export class CatalogStore {
  constructor(
    @Inject('CATALOG_REPOSITORY') private catalogRepo: Repository<Catalog>,
  ) {}

  public async getAllCatalog(): Promise<Catalog[]> {
    return await this.catalogRepo.find();
  }

  public async getCatalogBySku(sku: string): Promise<Catalog> {
    return await this.catalogRepo.findOne({ where: { sku } });
  }

  public async register(
    catalogEntity: Catalog,
    sku?: string,
  ): Promise<Catalog | Error> {
    if (sku) {
      return await this.update(catalogEntity, sku);
    } else {
      return await this.create(catalogEntity);
    }
  }

  private async create(catalogEntity: Catalog): Promise<Catalog | Error> {
    try {
      const catalog = this.catalogRepo.create(catalogEntity);
      return await this.catalogRepo.save(catalog);
    } catch (error) {
      return new Error(error);
    }
  }

  private async update(
    catalogEntity: Catalog,
    sku: string,
  ): Promise<Catalog | Error> {
    try {
      await this.catalogRepo.update({ sku }, catalogEntity);
      return this.catalogRepo.findOne({ where: { sku } });
    } catch (error) {
      return new Error(error);
    }
  }

  public async removeCatalog(sku: string): Promise<Catalog | Error> {
    try {
      const catalog = this.catalogRepo.findOne({ where: { sku } });
      await this.catalogRepo.delete({ sku });
      return catalog;
    } catch (error) {
      return new Error(error);
    }
  }
}
