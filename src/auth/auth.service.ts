import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: { name: string; email: string; password: string }) {
    return await this.prisma.user
      .create({
        data: {
          name: dto.name,
          email: dto.email,
          password: await argon.hash(dto.password),
        },
      })
      .then((user) => {
        delete user.password;
        return {
          statuscode: 201,
          user,
        };
      })
      .catch((err) => {
        console.log(err);
        throw new HttpException(
          {
            message: err ? err.message : 'cannot create user',
          },
          500,
        );
      });
  }

  // async login(dto: { email: string; password: string }) {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       email: dto.email,
  //     },
  //   });
  // }
}
