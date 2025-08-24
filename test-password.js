const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function testPassword() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'storypostmart@gmail.com' }
    })
    
    if (user && user.password) {
      const testPassword = 'k0bIEKibxfvzndGY'
      const isMatch = await bcrypt.compare(testPassword, user.password)
      
      console.log('Password test result:', isMatch ? '✅ Password matches' : '❌ Password does not match')
      
      if (!isMatch) {
        console.log('Testing with alternative passwords...')
        const alternatives = ['profit1993house@gmail.com', 'admin', '123456', 'password']
        
        for (const alt of alternatives) {
          const altMatch = await bcrypt.compare(alt, user.password)
          if (altMatch) {
            console.log(`✅ Found matching password: ${alt}`)
            break
          }
        }
      }
    } else {
      console.log('User or password not found')
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testPassword()