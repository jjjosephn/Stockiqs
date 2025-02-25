   import { Request, Response } from 'express';
   import { Prisma, PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient();

export const newSale = async (
   req: Request,
   res: Response
   ): Promise<void> => {
   try {
      const {saleId, userId, stockId, customerId, quantity, salesPrice, timestamp} = req.body;

      if (quantity < 1) {
         res.status(400).json({ message: "Quantity must be at least 1" });
         return;
      }

      const sale = await prisma.sales.create({
         data: {
            saleId,
            userId,
            stockId,
            customerId,
            quantity: parseInt(quantity),
            salesPrice: parseFloat(salesPrice),
            timestamp: new Date(timestamp)
         } as Prisma.SalesUncheckedCreateInput
      });
      res.status(201).json(sale);
   } catch (error) {
      res.status(500).json({ message: 'Error creating sale' });
   }
}

export const getSales = async (req: Request, res: Response): Promise<void> => {
   try {
      const {userId} = req.params;
      const sales = await prisma.sales.findMany({
         where: {
            userId
         },
         include: {
            customers: true,
            productStock: {
               include: {
                  product: true, 
               },
            },
            psArchive: {
               include: {
                  product: true,
               },
            },
         },
      });
      res.status(200).json(sales);
   } catch (error) {
      res.status(500).json({ message: "Error retrieving sales" });
   }
};


