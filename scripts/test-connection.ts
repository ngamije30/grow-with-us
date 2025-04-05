const { PrismaClient } = require('@prisma/client')
const { withAccelerate } = require('@prisma/extension-accelerate')

// Explicitly set the database URL for Prisma Accelerate
const DATABASE_URL = "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMWJkZTliZmItNTdiNC00OGJhLWI0MGQtZGY2Zjk1ZmViYzAzIiwidGVuYW50X2lkIjoiZmU3NTY5ZTBhMzQ0NzYwZmIyMWJmNzA4YzBlMDAxZGU5NzdlYTQwZjIzMzQ2MjMzOTQzYjJmOTcwZDJkY2JkOCIsImludGVybmFsX3NlY3JldCI6IjdiYzBlMjM3LWZlMjMtNGVhMS04MTY2LWIyNTBkYjRjYTYxZSJ9.-ImBsHghqqBs8kVYgyBw8VEzGAH_MoISCdgQgAOWsTA"

// Create a new PrismaClient instance with explicit configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
}).$extends(withAccelerate())

async function main() {
  try {
    console.log('Testing connection to Prisma Accelerate...')
    
    // Try to query the database
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`
    console.log('Connection successful!')
    console.log('Database info:', result)
    
    // Try to get the list of tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('Tables in the database:', tables)
    
  } catch (error) {
    console.error('Error connecting to the database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 