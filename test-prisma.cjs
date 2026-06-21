const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const messages = await prisma.message.findMany({ 
      take: 3, 
      orderBy: { createdAt: 'desc' } 
    });
    console.log(messages);
  } catch (e) {
    console.error("Prisma error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
