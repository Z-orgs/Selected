import { Controller, Get } from '@nestjs/common';
import {
  Body,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common/decorators';
import { JwtAdminAuthGuard } from 'src/auth/admin/jwtadmin-auth.guard';
import { AdminService } from './admin.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Request } from 'express';
import { Admin } from './model/admin.model';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  createAdmin(@Req() req: Request, @Body() createAdmin: CreateAdminDto) {
    return this.adminService.createAdmin(req.user as Admin, createAdmin);
  }

  @Put()
  @UseGuards(JwtAdminAuthGuard)
  changePassword(
    @Req() req: Request,
    @Body() changePassword: ChangePasswordDto,
  ) {
    return this.adminService.changePassword(req.user as Admin, changePassword);
  }

  @Put(':username')
  @UseGuards(JwtAdminAuthGuard)
  resetPassword(@Req() req: Request, @Param('username') username: string) {
    return this.adminService.resetPassword(req.user as Admin, username);
  }

  @Get('admin')
  @UseGuards(JwtAdminAuthGuard)
  getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @Get('admin/:id')
  @UseGuards(JwtAdminAuthGuard)
  getAdminById(@Param('id') id: string) {
    return this.adminService.getAdminById(id);
  }

  @Get('playlist')
  @UseGuards(JwtAdminAuthGuard)
  getAllPlaylists() {
    return this.adminService.getAllPlaylists();
  }

  @Get('playlist/:id')
  @UseGuards(JwtAdminAuthGuard)
  getPlaylistById(@Param('id') id: string) {
    return this.adminService.getPlaylistById(id);
  }

  @Get('album')
  @UseGuards(JwtAdminAuthGuard)
  getAllAlbums() {
    return this.adminService.getAllAlbums();
  }

  @Get('album/:id')
  @UseGuards(JwtAdminAuthGuard)
  getAlbumById(@Param('id') id: string) {
    return this.adminService.getAlbumById(id);
  }

  @Get('user')
  @UseGuards(JwtAdminAuthGuard)
  getAllUsers() {
    return this.adminService.getALlUsers();
  }

  @Get('track')
  @UseGuards(JwtAdminAuthGuard)
  getAllTracks() {
    return this.adminService.getAllTracks();
  }

  @Get('track/:id')
  @UseGuards(JwtAdminAuthGuard)
  getTrackById(@Param('id') id: string) {
    return this.adminService.getTrackById(id);
  }

  @Get('logger')
  @UseGuards(JwtAdminAuthGuard)
  getAllLoggers() {
    return this.adminService.getAllLoggers();
  }

  @Get('artist')
  @UseGuards(JwtAdminAuthGuard)
  getAllArtists() {
    return this.adminService.getAllArtists();
  }
}
