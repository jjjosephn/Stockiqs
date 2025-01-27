import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardMetric = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const popularProducts = await prisma.products.findMany({
         take: 15,
         orderBy: {
            stockQuantity: 'desc'
         }
      })

      const saleSummary = await prisma.salesSummary.findMany({
         take: 5,
         orderBy: {
            date: 'asc'
         }
      })

      const purchaseSummary = await prisma.purchaseSummary.findMany({
         take: 5,
         orderBy: {
            date: 'asc'
         }
      })

      const expenseSummary = await prisma.expenseSummary.findMany({
         take: 5,
         orderBy: {
            date: 'asc'
         }
      })

      const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany({
         take: 5,
         orderBy: {
            date: 'asc'
         }
      })

      const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => ({
         ...item,
         amount: item.amount.toString()
      }))

      res.json({
         popularProducts,
         saleSummary,
         purchaseSummary,
         expenseSummary,
         expenseByCategorySummary
      })
   } catch (error) {
      res.status(500).json({ message: 'Error retrieving dashboard metric' });
   }
}