import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Catalog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column()
  price: number;

  @Column()
  currency: string;
}
