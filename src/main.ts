import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalException } from './filters/global_exception.filter';
import { ConfigService } from '@nestjs/config';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // cookie session configuration
  app.use(cookieSession({ keys: [configService.get('COOKIE_SESSION_KEY')] }));

  // set validation pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalFilters(new GlobalException());

  // swagger configuration
  const config = new DocumentBuilder()
    .setTitle('blogging_api')
    .setDescription(
      'developing a Node.js backend application using NestJS and Postgres Database that serves as a RESTful API for a blogging platform.',
    )
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  // listening on port 3000
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
