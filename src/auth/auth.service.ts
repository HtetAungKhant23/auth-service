import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: { name: string }) {
    return await this.prisma.user
      .create({
        data: {
          name: dto.name,
        },
      })
      .then((user) => {
        return {
          statuscode: 201,
          user,
        };
      })
      .catch((err) => {
        throw new HttpException(
          {
            message: err ? err.message : 'cannot create user',
          },
          500,
        );
      });
  }
}
