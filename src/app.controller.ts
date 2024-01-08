import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'test_ms' })
  getHello(@Payload() data: string): string {
    console.log('ok na sa', data);
    return this.appService.getHello(data);
  }
}
