import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { MxzService } from './mxz.service';
import { CreateMxzDto } from './dto/create-mxz.dto';

@Controller('mxz')
export class MxzController {
  constructor(private readonly mxzService: MxzService) {}
}
