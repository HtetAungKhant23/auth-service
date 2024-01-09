import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [RedisModule],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
