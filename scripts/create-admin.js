const { PrismaClient } = require('../prisma/generated/client');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const prisma = new PrismaClient();
  const email = 'admin@almatexture.kz';
  const password = 'almaty2023'; // Replace with a more secure password

  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      console.log('✅ Admin user already exists:');
      console.log(`   Email: ${email}`);
      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const user = await prisma.user.create({
      data: {
        email: email,
        passwordHash: hashedPassword,
        role: 'admin',
        name: 'Admin User' // Optional name
      },
    });

    console.log('✅ Admin user created successfully:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password} (Use this for the first login)`);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.log('\nℹ️  Admin user already exists:');
    console.log(`   Email: admin@almatexture.kz`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 