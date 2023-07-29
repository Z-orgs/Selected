import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SELECTED } from './constants';
import * as cookieParser from 'cookie-parser';

(async () => {
  const App = await NestFactory.create(AppModule);
  App.use(cookieParser());
  App.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  App.enableCors({
    origin: '*',
    credentials: true,
  });
  await App.listen(SELECTED.PORT);
})();
