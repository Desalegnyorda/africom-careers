import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = "admin@africom.com"; // Change this
  const password = "YourSecurePassword123"; // Change this

  // 1. Hash the password for security
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Upsert the admin (This avoids creating duplicates if you run it twice)
  const admin = await prisma.admin.upsert({
    where: { email: email }, // Using 'email' as the unique field
    update: {},
    create: {
      email: email,
      password: hashedPassword,
    },
  });

  console.log({ admin });
  console.log("✅ Admin user seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });