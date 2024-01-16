import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RedisModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
