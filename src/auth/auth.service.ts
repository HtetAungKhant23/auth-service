import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

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

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user)
      throw new ForbiddenException(
        `We could not find user with email '${dto.email}'`,
      );

    const pwdMatches = await argon.verify(user.password, dto.password);
    if (!pwdMatches) throw new ForbiddenException("Password doesn't match!");
    delete user.password;
    return {
      statusCode: 200,
      user: user,
      token: await this.signToken(user.id, user.email),
    };
  }

  async signToken(userId: string, email: string) {
    const payload = {
      id: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_SECRET,
    });

    return token;
  }
}
