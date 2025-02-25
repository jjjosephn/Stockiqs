import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrUpdateUser = async (
   req: Request, 
   res: Response
): Promise<void> => {
   try {
      const { userId } = req.body;

      const existingUser = await prisma.users.findUnique({
         where: { userId },
      });

      if (existingUser) {
         res.status(200).json(existingUser);  
         return;
      }

      const newUser = await prisma.users.create({
         data: {
            userId,
         },
      });

      res.status(201).json(newUser); 
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error handling user creation or update' });
   }
};