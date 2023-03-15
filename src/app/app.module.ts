import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { TrackModule } from '../track/track.module';
import { FileModule } from '../file/file.module';
import { mxzASPIRE } from '../mxz/mxz.aspire';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(mxzASPIRE.MongoURI),
    UserModule,
    TrackModule,
    FileModule,
  ],
})
export class AppModule {}
