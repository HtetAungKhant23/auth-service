import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    // options: {
    //   port: 3001,
    // },
  });
  await app.startAllMicroservices();
  await app.listen(3001).then(() => {
    console.log('Auth Service is Successfully started 3001');
  });
}
bootstrap();
