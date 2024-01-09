import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      // host: 'localhost',
      port: 3003,
    },
  });
  await app.startAllMicroservices();
  await app.listen(3004).then(() => {
    console.log('Auth Service is Successfully started 3004');
  });
}
bootstrap();
