import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MxzModule } from './mxz/mxz.module';
import { SELECTED } from './constants';

(async () => {
  const app = await NestFactory.create(MxzModule);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  await app.listen(3000);
  SELECTED.UrlServer = await app.getUrl();
})();
