import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/admin/model/admin.model';
import { AdminStrategy } from './admin/admin-auth.guard';
import { JwtAdminStrategy } from './admin/jwtadmin-auth.guard';
import { Artist, ArtistSchema } from 'src/artist/model/artist.model';
import { ArtistStrategy } from './artist/artist-auth.guard';
import { JwtArtistStrategy } from './artist/jwtartist-auth.guard';
import { GoogleStrategy } from './google/google-auth.guard';
import { JwtStrategy } from './google/jwt-auth.guard';
import { User, UserSchema } from 'src/user/model/user.model';
import { SELECTED } from 'src/constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: SELECTED.ClientSecret,
      signOptions: { expiresIn: 15 * 60 },
    }),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Artist.name, schema: ArtistSchema },
      { name: User.name, schema: UserSchema },
    ]),
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
