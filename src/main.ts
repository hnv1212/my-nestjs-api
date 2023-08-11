import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { E_TOO_MANY_REQUESTS } from './common/exceptions';
import { APP_DESCRIPTION, APP_NAME, APP_VERSION } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // -- Helmet
  app.use(helmet());
  // -- Cors setup
  app.enableCors({
    // Specify the allowed origins.  I'm setting false to allow requests from any origin
    origin: false,
  });
  // -- Rate limitting
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
      skipSuccessfulRequests: false, // The counting will skip all successful requests and just count the errors. Instead of removing rate-limiting, it's better to set this to true to limit the number of times a request fails. Can help prevent against brute-force attacks
      message: { message: E_TOO_MANY_REQUESTS, statusCode: 403 },
    }),
  );
  // -- Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .addBearerAuth()
    .addBasicAuth({ type: 'apiKey', name: 'accessToken', in: 'query' }) // The API will use basic authentication for admin access
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
bootstrap();
