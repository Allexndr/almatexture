const { PrismaClient } = require('../prisma/generated/client');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  const prisma = new PrismaClient();
  const email = 'admin@almatexture.kz';
  const newPassword = 'almaty2023'; // Set a new temporary/default password

  try {
    // Find the admin user
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      console.log('❌ Учетная запись администратора не найдена');
      return;
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Обновление пароля
    await prisma.user.update({
      where: { email: email },
      data: { passwordHash },
    });

    console.log('✅ Пароль администратора успешно сброшен');
    console.log(`   Email: ${email}`);
    console.log(`   New Password: ${newPassword}`);
    console.log('   Please change this password after logging in.');
  } catch (error) {
    console.error('❌ Ошибка при сбросе пароля:', error);
    console.log(`   Make sure user with email ${email} exists.`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword(); 