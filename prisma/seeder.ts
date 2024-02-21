import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

const main = async () => {
  await prisma.role.createMany({
    data: [
      {
        name: 'superAdmin',
      },
      {
        name: 'admin',
      },
      {
        name: 'staff',
      },
      {
        name: 'user',
      },
    ],
  });

  await prisma.permission.createMany({
    data: [
      {
        role_id: (
          await prisma.role.findFirst({ where: { name: 'superAdmin' } })
        ).id,
        action: 'manage',
        subject: 'all',
      },
      {
        role_id: (await prisma.role.findFirst({ where: { name: 'user' } })).id,
        action: 'read',
        subject: 'product',
      },
    ],
  });

  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.user.create({
    data: {
      email: 'superAdmin@gmail.com',
      password: hashedPassword,
      role: {
        connect: {
          id: (await prisma.role.findFirst({ where: { name: 'superAdmin' } }))
            .id,
        },
      },
      profile: {
        create: {
          user_name: 'Super Admin',
        },
      },
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
