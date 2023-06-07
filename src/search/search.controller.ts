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
import { JwtArtistAuthGuard } from 'src/auth/artist/jwtartist-auth.guard';
import { Artist } from 'src/artist/model/artist.model';
import { Request } from 'express';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('search')
@UseInterceptors(CacheInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query('keyword') keyword: string) {
    return this.searchService.search(keyword);
  }
  @Get('track')
  @UseGuards(JwtArtistAuthGuard)
  searchTrackAsArtist(@Req() req: Request, @Body('keyword') keyword: string) {
    return this.searchService.searchTrack(req.user as Artist, keyword);
  }
}
