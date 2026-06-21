import { prisma } from './src/lib/db.server';

async function main() {
  const tables = ["Notification", "Follow", "Like", "Favorite", "Comment"];
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER PUBLICATION supabase_realtime ADD TABLE "${table}";`);
      console.log(`✓ Added ${table} to supabase_realtime publication`);
    } catch (e: any) {
      if (e.message?.includes("already member")) {
        console.log(`- ${table} already in publication`);
      } else {
        console.error(`✗ ${table}:`, e.message);
      }
    }
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" REPLICA IDENTITY FULL;`);
      console.log(`✓ REPLICA IDENTITY FULL set on ${table}`);
    } catch (e: any) {
      console.error(`✗ ${table} REPLICA IDENTITY:`, e.message);
    }
  }
}

main();
