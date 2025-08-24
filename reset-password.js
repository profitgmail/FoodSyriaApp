const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function resetPassword() {
  try {
    const email = 'storypostmart@gmail.com'
    const newPassword = 'k0bIEKibxfvzndGY'
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })
    
    console.log('✅ Password reset successful!')
    console.log(`User: ${updatedUser.email}`)
    console.log(`Name: ${updatedUser.name}`)
    console.log('You can now login with the password: k0bIEKibxfvzndGY')
    
  } catch (error) {
    console.error('Error resetting password:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

resetPassword()