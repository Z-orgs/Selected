import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './App/App.module';
import { SELECTED } from './constants';

(async () => {
  const App = await NestFactory.create(AppModule);
  App.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  App.enableCors({
    origin: '*',
    credentials: true,
  });
  await App.listen(3000);
  SELECTED.UrlServer = await App.getUrl();
})();
