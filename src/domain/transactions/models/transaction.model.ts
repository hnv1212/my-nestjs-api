import { ApiProperty } from '@nestjs/swagger';
import { TransactionCategoryEnum } from '../enums/transaction-category.enum';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';

export class Transaction {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: Object.values(TransactionTypeEnum) })
  type: TransactionTypeEnum;

  @ApiProperty({ enum: Object.values(TransactionCategoryEnum) })
  category: TransactionCategoryEnum;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userId: number;
}
