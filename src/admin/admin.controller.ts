import { Controller, Get } from '@nestjs/common';
import {
  Delete,
  Param,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { AdminService } from './admin.service';
import { Request } from 'express';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '../auth/google/jwt-auth.guard';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { RolesGuard } from '../auth/role/role.guard';

@Controller('admin')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.Boss)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('admin')
  getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @Get('playlist')
  getAllPlaylists() {
    return this.adminService.getAllPlaylists();
  }

  @Get('playlist/:id')
  getPlaylistById(@Param('id') id: string) {
    return this.adminService.getPlaylistById(id);
  }

  @Get('album')
  getAllAlbums() {
    return this.adminService.getAllAlbums();
  }

  @Get('album/:id')
  getAlbumById(@Param('id') id: string) {
    return this.adminService.getAlbumById(id);
  }

  @Get('user')
  getAllUsers() {
    return this.adminService.getALlUsers();
  }

  @Get('track')
  getAllTracks() {
    return this.adminService.getAllTracks();
  }

  @Get('track/:id')
  getTrackById(@Param('id') id: string) {
    return this.adminService.getTrackById(id);
  }

  @Get('logger')
  getAllLoggers() {
    return this.adminService.getAllLoggers();
  }

  @Get('artist')
  getAllArtists() {
    return this.adminService.getAllArtists();
  }
  @Put('payment/:id')
  paymentArtist(@Req() req: Request, @Param('id') id: string) {
    return this.adminService.paymentArtist(req.user, id);
  }
  @Delete('track/:id')
  deleteTrack(@Req() req: Request, @Param('id') id: string) {
    return this.adminService.deleteTrack(req.user, id);
  }
  @Delete('album/:id')
  deleteAlbum(@Req() req: Request, @Param('id') id: string) {
    return this.adminService.deleteAlbum(req.user, id);
  }
}
