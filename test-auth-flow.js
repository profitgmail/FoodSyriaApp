const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function testAuthFlow() {
  try {
    const email = 'storypostmart@gmail.com'
    const password = 'k0bIEKibxfvzndGY'
    
    console.log('Testing authentication flow...')
    console.log('Email:', email)
    console.log('Password:', password)
    
    // Step 1: Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    console.log('✅ User found:', user.email)
    console.log('User ID:', user.id)
    console.log('User name:', user.name)
    
    // Step 2: Check password
    if (!user.password) {
      console.log('❌ User has no password hash')
      return
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('Password validation:', isPasswordValid ? '✅ Valid' : '❌ Invalid')
    
    if (!isPasswordValid) {
      console.log('The password does not match the hash.')
      console.log('This is why the login is failing.')
      return
    }
    
    // Step 3: Check if user object is correct for NextAuth
    const userForNextAuth = {
      id: user.id,
      email: user.email,
      name: user.name,
    }
    
    console.log('✅ User object for NextAuth:', userForNextAuth)
    console.log('✅ Authentication flow test passed!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testAuthFlow()