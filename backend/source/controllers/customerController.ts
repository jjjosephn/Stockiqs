import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCustomers = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const { userId } = req.params
      const customers = await prisma.customers.findMany({
         where: {
            userId
         }
      })
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
      const { userId, customerId } = req.params;

      if (!userId || !customerId) {
         res.status(400).json({ message: "Missing userId or customerId" });
      }

      const customer = await prisma.customers.findUnique({
         where: { customerId, userId }
      });

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
      const { customerId, userId, phoneNumber, name, instagram, streetAddress, city, state, zipCode } = req.body;

      if (!userId) {
         res.status(400).json({ message: 'User ID is required' });
      }

      const customer = await prisma.customers.create({
         data: {
            customerId,
            name,
            phoneNumber,
            instagram,
            streetAddress,
            city,
            state,
            zipCode,
            user: { connect: { userId: userId } } 
         }
      });

      res.status(201).json({ message: 'Customer created successfully', customer });

   } catch (error) {
      console.error(error); 
      res.status(500).json({ message: 'Error creating customer', error });
   }
}


export const deleteCustomer = async (
   req: Request,
   res: Response  
): Promise<void> => {
   try {
      const { customerId } = req.params
      await prisma.customers.delete({
         where: {
            customerId
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
      const { customerId } = req.params
      const { phoneNumber, name, instagram, streetAddress, city, state, zipCode } = req.body
      const customer = await prisma.customers.update({
         where: {
            customerId
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