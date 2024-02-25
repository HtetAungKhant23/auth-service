import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'sign-up' })
  signup(@Payload() dto: { email: string; name: string; password: string }) {
    return this.authService.signup(dto.email, dto.name, dto.password);
  }

  @MessagePattern({ cmd: 'sign-in' })
  login(@Payload() dto: { email: string; password: string }) {
    return this.authService.login(dto.email, dto.password);
  }
}
