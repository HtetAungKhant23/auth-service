import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { CustomRpcException } from 'src/libs/exception/custom-rpc-exception';
import { Responser } from 'src/libs/exception/Responser';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async invite(dto: {
    name: string;
    phone: string;
    email: string;
    role: 'Admin' | 'Staff';
  }) {
    const existingStaffOrAdmin = await this.prisma.user.findFirst({
      where: {
        phone: dto.phone,
        email: dto.email,
      },
    });
    if (existingStaffOrAdmin)
      throw new Error('Phone number or email already exist');

    return await this.prisma.user
      .create({
        data: {
          phone: dto.phone,
          email: dto.email,
          userProfile: {
            create: {
              username: dto.name,
              role: dto.role,
            },
          },
        },
        include: {
          userProfile: true,
        },
      })
      .then((newInvited) => {
        return Responser({
          statusCode: 201,
          message: 'New invitation success',
          data: newInvited,
        });
      })
      .catch((err) => {
        throw new CustomRpcException(
          400,
          'Fail to new invite',
          err.code ? err.meta : err.message,
        );
      });
  }

  async signup(dto: { name: string; email: string; password: string }) {
    return await this.prisma.user
      .create({
        data: {
          email: dto.email,
          password: await argon.hash(dto.password),
          userProfile: {
            create: {
              username: dto.name,
            },
          },
        },
      })
      .then((user) => {
        delete user.password;
        return Responser({
          statusCode: 201,
          message: 'Sing up user successfully',
          data: user,
        });
      })
      .catch((err) => {
        throw new CustomRpcException(
          400,
          'User account cannot create',
          err.code ? err.meta : err.message,
        );
      });
  }

  async login(dto: { email: string; password: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
        include: {
          userProfile: true,
        },
      });
      if (!user) throw new Error(`Cannot find user with email ${dto.email}`);

      const pwdMatches = await argon.verify(user.password, dto.password);
      if (!pwdMatches) throw new Error("Password doesn't match!");

      delete user.password;
      return Responser({
        statusCode: 200,
        message: 'Login successfully',
        data: {
          user,
          token: await this.signToken(user.id, user.userProfile.role),
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

  async signToken(userId: string, role: string) {
    const payload = {
      id: userId,
      role,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_SECRET,
    });

    return token;
  }
}
