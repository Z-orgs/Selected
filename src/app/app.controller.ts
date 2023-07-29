import { Controller, Get, Query } from '@nestjs/common';
import { SELECTED } from 'src/constants';

@Controller()
export class AppController {
  @Get()
  devIp(@Query('ip') ip: string) {
    SELECTED.DevIp = `http://${ip}`;
    console.log(SELECTED);

    return;
  }
}
