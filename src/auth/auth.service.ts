import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { CustomRpcException } from 'src/libs/exception/custom-rpc-exception';
import { Responser } from 'src/libs/exception/Responser';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signup(name: string, email: string, password: string) {
    return this.prisma.user
      .create({
        data: {
          email: email,
          password: await argon.hash(password),
          profile: {
            create: {
              user_name: name,
            },
          },
          role: {
            connect: {
              id: (
                await this.prisma.role.findFirst({ where: { name: 'user' } })
              ).id,
            },
          },
        },
      })
      .then((user) => {
        delete user.password;
        return Responser({
          statusCode: 201,
          message: 'Signup successfully',
          data: user,
        });
      })
      .catch((err) => {
        throw new CustomRpcException(
          400,
          'user account cannot create',
          err.code ? err.meta : err.message,
        );
      });
  }

  async login(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
        include: {
          profile: true,
          role: {
            include: {
              Permission: true,
            },
          },
        },
      });
      if (!user) throw new Error(`Cannot find user with this email[${email}]`);

      const pwdMatches = await argon.verify(user.password, password);
      if (!pwdMatches) throw new Error("Password doesn't match!");

      delete user.password;
      return Responser({
        statusCode: 200,
        message: 'Login successfully',
        data: {
          user,
          token: await this.signToken(user.id, user.role.name),
        },
      });
    } catch (err) {
      throw new CustomRpcException(
        400,
        'Login fail',
        err.code ? err.meta : err.message,
      );
    }
  }

  async signToken(userId: string, role_name: string) {
    const payload = {
      user_id: userId,
      role_name,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_SECRET,
    });

    return token;
  }
}
