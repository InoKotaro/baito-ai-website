import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.job.create({
    data: {
      jobTitle: 'ホールスタッフ',
      companyName: 'デリッシュAI',
      jobRole: 'ホールスタッフお願いします。',
      description: 'ホールスタッフサンプル',
      hourlyWage: 1270,
      line: { connect: { id: 1 } },
      occupation: { connect: { id: 2 } },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
