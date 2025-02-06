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

export const createCustomer = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const { userId, name, email } = req.body
      const customer = await prisma.users.create({
         data: {
            userId,
            name,
            email
         }
      })
   res.status(201).json({ message: 'User created', customer });
   } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
   }
}