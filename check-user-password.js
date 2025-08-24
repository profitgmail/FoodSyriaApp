const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function checkUserPassword() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'storypostmart@gmail.com' }
    })
    
    if (user) {
      console.log('User found:')
      console.log('- Email:', user.email)
      console.log('- Name:', user.name)
      console.log('- Password hash:', user.password ? 'Hash exists' : 'No password')
      console.log('- Created:', user.createdAt)
    } else {
      console.log('User not found')
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserPassword()