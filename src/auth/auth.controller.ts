import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'signup' })
  signup(@Payload() dto: { name: string; email: string; password: string }) {
    return this.authService.signup(dto);
  }

  @MessagePattern({ cmd: 'login' })
  login(@Payload() dto: { name: string }) {
    // return this.authService.login(dto);
  }
}
