import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const analyticsController = {
  async getUserActivity(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.userId;
      
      const activities = await prisma.userActivity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });

      const aggregatedData = activities.reduce((acc: any, activity) => {
        const date = activity.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { total: 0, byType: {} };
        }
        acc[date].total++;
        acc[date].byType[activity.type] = (acc[date].byType[activity.type] || 0) + 1;
        return acc;
      }, {});

      res.json(aggregatedData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching analytics' });
    }
  },

  async getContentEngagement(req: AuthRequest, res: Response) {
    try {
      const engagements = await prisma.contentEngagement.groupBy({
        by: ['type'],
        _count: {
          id: true,
        },
        where: {
          userId: req.user.userId,
        },
      });

      res.json(engagements);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching engagement metrics' });
    }
  },
};