import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const messageController = {
  // Get all conversations
  getConversations: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const conversations = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(conversations);
    } catch (error) {
      console.error('Error getting conversations:', error);
      res.status(500).json({ message: 'Error fetching conversations' });
    }
  },

  // Get messages with a specific user
  getMessages: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { otherUserId } = req.params;

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { AND: [{ senderId: userId }, { receiverId: otherUserId }] },
            { AND: [{ senderId: otherUserId }, { receiverId: userId }] }
          ]
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              profileImage: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      res.json(messages);
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({ message: 'Error fetching messages' });
    }
  },

  // Send a message
  sendMessage: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { receiverId, content } = req.body;

      const message = await prisma.message.create({
        data: {
          content,
          senderId: userId,
          receiverId,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              profileImage: true
            }
          }
        }
      });

      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Error sending message' });
    }
  },

  // Delete a message
  deleteMessage: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { messageId } = req.params;

      const message = await prisma.message.findUnique({
        where: { id: messageId }
      });

      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      if (message.senderId !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this message' });
      }

      await prisma.message.delete({
        where: { id: messageId }
      });

      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ message: 'Error deleting message' });
    }
  }
};