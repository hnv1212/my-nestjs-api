import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductRegistrationDto } from './dtos/product-registration.dto';
import { ProductModificationDto } from './dtos/product-modification.dto';
import { Product } from './entities/product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAll(): Promise<Product[] | Error> {
    return this.productService.getAll();
  }

  @Get(':sku')
  getBySku(@Param('sku') sku: string): Promise<Product | Error> {
    return this.productService.getBySku(sku);
  }

  @Post()
  productRegistration(
    @Body() dto: ProductRegistrationDto,
  ): Promise<Product | Error> {
    const { name, sku, price, currency } = dto;
    return this.productService.productRegistration(name, sku, price, currency);
  }

  @Put(':sku')
  public productModification(
    @Body() dto: ProductModificationDto,
    @Param('sku') sku: string,
  ): Promise<Product | Error> {
    const { name, price, currency } = dto;
    return this.productService.productModification(name, sku, price, currency);
  }

  @Delete(':sku')
  async delete(@Param('sku') sku: string): Promise<Product | Error> {
    return this.productService.removeProduct(sku);
  }
}
