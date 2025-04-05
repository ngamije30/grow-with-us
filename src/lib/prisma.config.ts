import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Explicitly set the database URL for Prisma Accelerate
const DATABASE_URL = "postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMWJkZTliZmItNTdiNC00OGJhLWI0MGQtZGY2Zjk1ZmViYzAzIiwidGVuYW50X2lkIjoiZmU3NTY5ZTBhMzQ0NzYwZmIyMWJmNzA4YzBlMDAxZGU5NzdlYTQwZjIzMzQ2MjMzOTQzYjJmOTcwZDJkY2JkOCIsImludGVybmFsX3NlY3JldCI6IjdiYzBlMjM3LWZlMjMtNGVhMS04MTY2LWIyNTBkYjRjYTYxZSJ9.-ImBsHghqqBs8kVYgyBw8VEzGAH_MoISCdgQgAOWsTA"

// Create a new PrismaClient instance with explicit configuration
const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
}).$extends(withAccelerate())

export default prismaClient 