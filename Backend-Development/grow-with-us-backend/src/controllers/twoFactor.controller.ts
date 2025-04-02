import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export const twoFactorController = {
  async enable2FA(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.userId;
      const secret = authenticator.generateSecret();
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorSecret: secret,
          twoFactorEnabled: true,
        },
      });

      const otpauth = authenticator.keyuri(
        req.user.email,
        'GrowWithUs',
        secret
      );

      const qrCode = await QRCode.toDataURL(otpauth);

      res.json({
        secret,
        qrCode,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error enabling 2FA' });
    }
  },

  async verify2FA(req: AuthRequest, res: Response) {
    try {
      const { token } = req.body;
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
      });

      if (!user?.twoFactorSecret) {
        return res.status(400).json({ message: '2FA not enabled' });
      }

      const isValid = authenticator.verify({
        token,
        secret: user.twoFactorSecret,
      });

      if (!isValid) {
        return res.status(400).json({ message: 'Invalid 2FA token' });
      }

      res.json({ message: 'Token verified successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying 2FA token' });
    }
  },
};