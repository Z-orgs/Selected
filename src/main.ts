import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { KwzngModule } from './Kwzng/Kwzng.module';
import { SELECTED } from './constants';

(async () => {
  const Kwzng = await NestFactory.create(KwzngModule);
  Kwzng.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  Kwzng.enableCors({
    origin: '*',
    credentials: true,
  });
  await Kwzng.listen(3000);
  SELECTED.UrlServer = await Kwzng.getUrl();
})();
