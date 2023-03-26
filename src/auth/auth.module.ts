import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { env } from 'src/m/x/z/a/s/p/i/r/e/env';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
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

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.ClientSecret,
      signOptions: { expiresIn: env.ExpiresIn },
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
