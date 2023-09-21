import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/domain/users/entities/user.entity';
import { TransactionTypeEnum } from './enums/transaction-type.enum';
import { TransactionCategoryEnum } from './enums/transaction-category.enum';
import { FindTransactionsDto } from './dto/find-transactions.dto';
import { ResultsMetadata } from 'src/common/models/results-metadata.model';
import {
  E_TRANSACTION_NOT_FOUND,
  E_UNAUTHORIZED_ACCESS_TO_RESOURCE,
  E_USER_NOT_FOUND,
} from 'src/common/exceptions';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepo: Repository<Transaction>,
  ) {}

  async create(dto: CreateTransactionDto, currentUser: User) {
    // Save & return the new transaction
    let transaction = await this.transactionsRepo.save({
      ...dto,
      user: currentUser,
      type: [
        TransactionCategoryEnum.revenue,
        TransactionCategoryEnum.grant,
        TransactionCategoryEnum.loanPayment,
        TransactionCategoryEnum.debt,
      ].includes(dto.category)
        ? TransactionTypeEnum.credit
        : TransactionTypeEnum.debit,
      reason: dto.reason || null,
      date: dto.date || new Date(),
    });
    delete transaction.user;
    return transaction;
  }

  async findAll(
    { offset = 0, limit = 12, sortField, sortOrder }: FindTransactionsDto,
    currentUser: User,
  ): Promise<{ data: Transaction[]; meta: ResultsMetadata }> {
    const [data, count] = await this.transactionsRepo.findAndCount({
      where: { userId: currentUser.id },
      order: {
        [sortField || 'createdAt']: (sortOrder || 'desc').toUpperCase(),
      },
      skip: offset,
      take: limit,
    });

    return {
      data,
      meta: {
        total: count,
        offset: offset,
        limit: limit,
      },
    };
  }

  async findOne(id: number, currentUser: User): Promise<Transaction> {
    const transaction = await this.findOneByField(id);
    if (!transaction) throw new NotFoundException(E_TRANSACTION_NOT_FOUND);
    if (transaction.userId !== currentUser.id)
      throw new UnauthorizedException(E_UNAUTHORIZED_ACCESS_TO_RESOURCE);
    return transaction;
  }

  async findOneByField(
    fieldValue: number | string,
    fieldName: string = 'id',
  ): Promise<Transaction> {
    // relations => in case e need to load some transaction relations
    return await this.transactionsRepo.findOne({
      where: { [fieldName]: fieldValue },
    });
  }

  async getAccountBalance(userId: number): Promise<number> {
    const { balance } = await this.transactionsRepo
      .createQueryBuilder('item')
      .select(
        "SUM(CASE item.type WHEN 'credit' THEN item.amount ELSE item.amount* -1 END",
        'balance',
      )
      .where({ userId })
      .getRawOne();

    return balance;
  }

  async update(
    id: number,
    dto: UpdateTransactionDto,
    currentUser: User,
  ): Promise<Transaction> {
    const transaction = await this.findOneByField(id);
    if (!transaction) throw new NotFoundException(E_TRANSACTION_NOT_FOUND);

    if (transaction.userId != currentUser.id)
      throw new UnauthorizedException(E_UNAUTHORIZED_ACCESS_TO_RESOURCE);

    Object.assign(transaction, {
      ...dto,
      type: [
        TransactionCategoryEnum.revenue,
        TransactionCategoryEnum.grant,
        TransactionCategoryEnum.loanPayment,
        TransactionCategoryEnum.debt,
      ].includes(dto.category || transaction.category)
        ? TransactionTypeEnum.credit
        : TransactionTypeEnum.debit,
      reason: dto.reason || transaction.reason,
      date: dto.date || transaction.date,
    });

    await this.transactionsRepo.save(transaction);
    return transaction;
  }

  async remove(id: number, currentUser: User): Promise<Transaction> {
    const transaction = await this.findOneByField(id);
    if (!transaction) throw new NotFoundException(E_USER_NOT_FOUND);
    if (transaction.userId !== currentUser.id)
      throw new UnauthorizedException(E_UNAUTHORIZED_ACCESS_TO_RESOURCE);

    await this.transactionsRepo.delete(id);
    return transaction;
  }
}
