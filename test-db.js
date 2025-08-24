const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  try {
    console.log('Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Check users
    const users = await prisma.user.findMany()
    console.log(`\n📊 Found ${users.length} users in database:`)
    
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`- ${user.email} (${user.name || 'No name'}) - Created: ${user.createdAt}`)
      })
    } else {
      console.log('❌ No users found in database')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()