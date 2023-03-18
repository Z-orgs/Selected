import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { TrackModule } from '../track/track.module';
import { FileModule } from '../file/file.module';
import { mxzASPIRE } from '../mxz/mxz.aspire';
import { Admin, AdminSchema } from 'src/admin/model/admin.model';
import { AppController } from './app.controller';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(mxzASPIRE.MongoURI),
    UserModule,
    TrackModule,
    FileModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  controllers: [AppController],
})
export class AppModule {}
