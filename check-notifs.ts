import { prisma } from './src/lib/db.server';

async function main() {
  const notifs = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { actor: true }
  });
  console.log(JSON.stringify(notifs, null, 2));
}

main();
