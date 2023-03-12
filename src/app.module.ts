import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ENVConstants } from './env.constants';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(ENVConstants.MongoURI),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
