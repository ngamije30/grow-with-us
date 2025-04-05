import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const accelerateClient = new PrismaClient().$extends(withAccelerate())

export default accelerateClient 