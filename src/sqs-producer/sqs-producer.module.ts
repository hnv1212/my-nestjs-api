import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';
import { SqsMessageProducer } from './sqs-message-producer.service';

AWS.config.update({
  region: process.env.SQS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

@Module({
  imports: [
    SqsModule.register({
      consumers: [],
      producers: [
        {
          name: process.env.TEST_QUEUE,
          queueUrl: process.env.TEST_QUEUE_URL,
          region: process.env.SQS_REGION,
        },
      ],
    }),
  ],
  providers: [SqsMessageProducer],
  exports: [SqsMessageProducer],
})
export class SqsProducerModule {}
