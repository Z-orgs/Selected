import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MxzModule } from './mxz/mxz.module';
import { env } from './m/x/z/a/s/p/i/r/e/env';

(async () => {
  const app = await NestFactory.create(MxzModule);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  app.enableCors({
    origin: 'http://localhost:3006/',
    credentials: true,
  });
  await app.listen(3000);
  env.UrlServer = await app.getUrl();
  console.log(env.UrlServer);
})();
