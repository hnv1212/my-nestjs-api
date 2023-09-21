import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './domain/users/users.module';
import { AuthModule } from './auth/auth.module';
import { SqsProducerModule } from './sqs-producer/sqs-producer.module';
import { SqsConsumerModule } from './sqs-consumer/sqs-consumer.module';
import { TransactionsModule } from './domain/transactions/transactions.module';
import { CatalogModule } from './domain/catalog/catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(4000),
        NODE_ENV: Joi.string().default('development'),
        DB_HOST: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SSL: Joi.boolean().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    TransactionsModule,
    // SqsProducerModule,
    // SqsConsumerModule,
    CatalogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
