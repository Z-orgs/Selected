import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  // @Get(':id')
  // @UseGuards(JwtAdminAuthGuard)
  // getLoggerById(@Param('id') id: string) {
  //   return this.loggerService.getLoggerById(id);
  // }
}
