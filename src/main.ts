import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MxzModule } from './mxz/mxz.module';
import { SELECTED } from './constants';

(async () => {
  const mxz = await NestFactory.create(MxzModule);
  mxz.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  mxz.enableCors({
    origin: '*',
    credentials: true,
  });
  await mxz.listen(3000);
  SELECTED.UrlServer = await mxz.getUrl();
})();
