import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: Track.name,
        schema: TrackSchema,
      },
    ]),
  ],
  providers: [UserService],
})
export class UserModule {}
