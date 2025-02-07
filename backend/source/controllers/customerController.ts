import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCustomers = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const customers = await prisma.customers.findMany()
      res.json(customers)
   } catch (error) {
      res.status(500).json({ message: 'Error retrieving customers' });
   }
}

export const createCustomer = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const { userId, phoneNumber, name, instagram, streetAddress, city, state, zipCode } = req.body
      const customer = await prisma.customers.create({
         data: {
            userId,
            name,
            phoneNumber,
            instagram,
            streetAddress,
            city,
            state,
            zipCode  
         }
      })
   res.status(201).json({ message: 'User created', customer });
   } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
   }
}