import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();  

export const getProductsArchive = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const count = await prisma.productsArchive.count();
      console.log(`Found ${count} products in archive`);
      
      const productsArchive = await prisma.productsArchive.findMany({
         include: {
            psArchive: true
         }
      })
      res.json(productsArchive)
   }
   catch (error) {
      res.status(500).json({ message: 'Error retrieving products archive' });
   }
}