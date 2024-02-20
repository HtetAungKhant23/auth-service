import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { env } from './configs/env-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: env.host,
      port: env.port,
      ...(env.password && { password: env.password }),
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001).then(() => {
    Logger.log('🚀 Auth Service Successfully started at 3001');
  });
}
bootstrap();
