import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { mxzASPIRE } from 'src/mxz/mxz.aspire';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/admin/model/admin.model';
import { AdminStrategy } from './admin/admin-auth.guard';
import { JwtAdminStrategy } from './admin/jwtadmin-auth.guard';
import { Artist, ArtistSchema } from 'src/artist/model/artist.model';
import { ArtistStrategy } from './artist/artist-auth.guard';
import { JwtArtistStrategy } from './artist/jwtartist-auth.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: mxzASPIRE.ClientSecret,
      signOptions: { expiresIn: mxzASPIRE.ExpiresIn },
    }),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    AdminStrategy,
    JwtAdminStrategy,
    ArtistStrategy,
    JwtArtistStrategy,
  ],
})
export class AuthModule {}
