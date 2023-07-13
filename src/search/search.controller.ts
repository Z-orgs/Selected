import {
  Body,
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { Request } from 'express';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '../auth/google/jwt-auth.guard';
import { RolesGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';

@Controller('search')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Roles(Role.User)
  search(@Query('keyword') keyword: string) {
    return this.searchService.search(keyword);
  }
  @Get('track')
  @Roles(Role.Artist)
  searchTrackAsArtist(@Req() req: Request, @Body('keyword') keyword: string) {
    return this.searchService.searchTrack(req.user, keyword);
  }
}
