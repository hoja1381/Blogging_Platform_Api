import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VerifyToken } from './middleware/verify_token.middleware';
import { ValidationPipe } from '@nestjs/common';

const dotenv = require('dotenv');
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  app.use(cookieSession({ keys: [process.env.COOKIE_SESSION_KEY] }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // listening on port 3000
  await app.listen(3000);
}
bootstrap();
