import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

// Easy demo password for all seeded test accounts
export const DEMO_PASSWORD = 'demo123';

const users = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    role: 'ADMIN',
    bio: 'Samaagum platform administrator',
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'HOST',
    bio: 'College event host and tech club lead',
  },
  {
    name: 'Rohan Iyer',
    email: 'rohan.iyer@example.com',
    role: 'MEMBER',
    bio: 'Coding enthusiast and campus workshop attendee',
  },
  {
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@example.com',
    role: 'MEMBER',
    bio: 'UI/UX design student and music club member',
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@example.com',
    role: 'MEMBER',
    bio: 'Debate society member and photographer',
  },
];

async function main() {
  console.log('Starting database seed...');
  console.log(`Hashing demo password with argon2...`);
  const passwordHash = await argon2.hash(DEMO_PASSWORD);

  for (const user of users) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
        bio: user.bio,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash,
        bio: user.bio,
      },
    });

    console.log(`Seeded user: ${record.name} <${record.email}> [${record.role}]`);
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
