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

export const getCustomer = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const { userId } = req.params
      const customer = await prisma.customers.findUnique({
         where: {
            userId
         }
      })
      res.status(200).json(customer);
   } catch (error) {
      res.status(500).json({ message: 'Error retrieving customer' });
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

export const deleteCustomer = async (
   req: Request,
   res: Response  
): Promise<void> => {
   try {
      const { userId } = req.params
      await prisma.customers.delete({
         where: {
            userId
         }
      })
      res.status(200).json({ message: 'User deleted' });
   }
   catch (error) {
      res.status(500).json({ message: 'Error deleting user' });
   }
}

export const updateCustomer = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const { userId } = req.params
      const { phoneNumber, name, instagram, streetAddress, city, state, zipCode } = req.body
      const customer = await prisma.customers.update({
         where: {
            userId
         },
         data: {
            name,
            phoneNumber,
            instagram,
            streetAddress,
            city,
            state,
            zipCode
         }
      })
      res.status(200).json({ message: 'User updated', customer });
   } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
   }
}