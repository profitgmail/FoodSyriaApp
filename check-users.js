import { db } from './src/lib/db'

async function checkUsers() {
  try {
    const users = await db.user.findMany()
    console.log('Users in database:', users.length)
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Created: ${user.createdAt}`)
    })
  } catch (error) {
    console.error('Error checking users:', error)
  }
}

checkUsers()