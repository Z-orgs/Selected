import { Controller } from '@nestjs/common';
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
}
