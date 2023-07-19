import { Body, Controller, Param, Put } from '@nestjs/common';
import { UseGuards, UseInterceptors } from '@nestjs/common/decorators';

import { CacheInterceptor } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '../../auth/google/jwt-auth.guard';
import { RolesGuard } from '../../auth/role/role.guard';
import { Roles } from '../../auth/role/roles.decorator';
import { Role } from '../../auth/role/role.enum';
import { BossService } from './boss.service';

@Controller('boss')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Boss)
export class BossController {
  constructor(private readonly bossService: BossService) {}
  @Put('user/:id')
  updateRole(@Param('id') id: string, @Body('roles') roles: string) {
    const inputRoles = JSON.parse(roles);
    return this.bossService.updateRole(id, inputRoles);
  }
}
