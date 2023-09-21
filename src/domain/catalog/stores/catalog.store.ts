import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Catalog } from "../entities/catalog.entity";

@Injectable()
export class CatalogStore {
    constructor(@Inject('CATALOG_REPOSITORY') private catalogRepo: Repository<Catalog>) {}

    public async getAllCatalog(): Promise<>
}