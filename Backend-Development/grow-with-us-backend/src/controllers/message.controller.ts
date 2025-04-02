import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const messageController = {
  async sendMessage(req: AuthRequest, res: Response) {
    try {
      const { receiverId, content } = req.body;
      const senderId = req.user.userId;

      const message = await prisma.message.create({
        data: {
          content,
          senderId,
          receiverId,
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error sending message' });
    }
  },

  async getMessages(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.userId;
      const { otherUserId } = req.params;

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { AND: [{ senderId: userId }, { receiverId: otherUserId }] },
            { AND: [{ senderId: otherUserId }, { receiverId: userId }] },
          ],
        },
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching messages' });
    }
  },
};