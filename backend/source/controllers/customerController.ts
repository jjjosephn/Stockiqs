import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCustomers = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const customers = await prisma.users.findMany()
      res.json(customers)
   } catch (error) {
      res.status(500).json({ message: 'Error retrieving users' });
   }
}