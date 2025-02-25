import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPurchases = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {userId} = req.params;
    const purchases = await prisma.purchases.findMany({
      where: {
        userId
      },
      include: {
        productStock: {
          include: {
            product: true,
          },
        },
        psArchive: {
          include: {
            product: true,
          },
        }
      }
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving purchases' });
  }
}
