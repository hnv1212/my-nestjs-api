import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';
import { TestQueueHandler } from './test-queue-hander';

AWS.config.update({
  region: process.env.SQS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: process.env.TEST_QUEUE,
          queueUrl: process.env.TEST_QUEUE_URL,
          region: process.env.SQS_REGION,
        },
      ],
    }),
  ],
  providers: [TestQueueHandler],
  exports: [TestQueueHandler],
})
export class SqsConsumerModule {}
