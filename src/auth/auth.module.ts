import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleStrategy } from './google/google-auth.guard';
import { JwtStrategy } from './google/jwt-auth.guard';
import { User, UserSchema } from 'src/user/model/user.model';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role/role.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, RolesGuard],
  exports: [RolesGuard, JwtModule],
})
export class AuthModule {}
