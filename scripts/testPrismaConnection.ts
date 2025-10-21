import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Testing Prisma + Supabase connection...");

  const users = await prisma.user.findMany();
  console.log("✅ Connection successful! Current users:", users);
}

main()
  .catch((err) => console.error("❌ Connection failed:", err))
  .finally(async () => await prisma.$disconnect());
