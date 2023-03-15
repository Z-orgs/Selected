import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

(async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  app.enableCors({
    origin: 'http://localhost:80/',
    credentials: true,
  });
  await app.listen(3000);
})();
