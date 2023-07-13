import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SELECTED } from './constants';
import { readFileSync } from 'fs';

(async () => {
  const App = await NestFactory.create(AppModule);
  App.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  App.enableCors({
    origin: '*',
    credentials: true,
  });
  await App.listen(SELECTED.PORT);
})();
