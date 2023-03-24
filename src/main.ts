import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MxzModule } from './mxz/mxz.module';

(async () => {
  const app = await NestFactory.create(MxzModule);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  app.enableCors({
    origin: 'http://localhost/',
    credentials: true,
  });
  await app.listen(3000);
})();
