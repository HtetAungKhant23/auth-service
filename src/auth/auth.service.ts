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

  async invite(dto: {
    name: string;
    phone: string;
    email: string;
    role: 'Admin' | 'Moderator';
  }) {
    const staffExist = await this.prisma.user.findFirst({
      where: {
        phone: dto.phone,
      },
    });
    if (staffExist) {
      throw new HttpException(
        {
          message: 'Phone number already exist',
        },
        500,
      );
    }

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
      .then((staff) => {
        return {
          statusCode: 201,
          staff,
        };
      })
      .catch((err) => {
        throw new HttpException(
          {
            message: err ? err.message : 'cannot create staff',
          },
          500,
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
      include: {
        userProfile: true,
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
      token: await this.signToken(user.id, user.userProfile.role),
    };
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
