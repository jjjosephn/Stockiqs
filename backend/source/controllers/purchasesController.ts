import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPurchases = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const purchases = await prisma.purchases.findMany({
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
