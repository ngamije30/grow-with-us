import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const analyticsService = {
  async trackUserActivity(userId: string, type: string, metadata: any = {}) {
    return prisma.userActivity.create({
      data: {
        userId,
        type,
        metadata,
      },
    });
  },

  async getDetailedAnalytics(userId: string, startDate: Date, endDate: Date) {
    const [activities, engagements, messages] = await Promise.all([
      // User activities
      prisma.userActivity.groupBy({
        by: ['type', 'createdAt'],
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: true,
      }),

      // Content engagements
      prisma.contentEngagement.groupBy({
        by: ['type'],
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: true,
      }),

      // Message statistics
      prisma.message.aggregate({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: true,
        _avg: {
          size: true,
        },
      }),
    ]);

    return {
      activities,
      engagements,
      messageStats: messages,
    };
  },
};