import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const search = req.query.search?.toString()
      const products = await prisma.products.findMany({
         where: {
            name: {
               contains: search,
               mode: 'insensitive'
            }
         },
         include: {
            stock: true
         }
      })
      res.json(products)
   } catch (error) {
      res.status(500).json({ message: 'Error retrieving products' });
   }
}

export const createProduct = async (
   req: Request,
   res: Response
): Promise<void> => {
   try{
      const { name, stock } = req.body; 

      if (!name || !Array.isArray(stock)) {
         res.status(400).json({ message: 'Name and stock array are required' });
         return;
      }

      const product = await prisma.products.create({
         data: {
            name,
            stock: {
               create: stock.map(({ size, quantity, price }) => ({
                  size,
                  quantity,
                  price
               }))
            }
         },
         include: {
            stock: true
         }
      });

      res.status(201).json(product);
   } catch (error) {
      res.status(500).json({ message: 'Error creating product' });
   }
}

export const deleteProduct = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const { productId } = req.params
      
      await prisma.productStock.deleteMany({
         where: {
            productId
         }
      })
      await prisma.products.delete({
         where: {
            productId
         }
      })
      res.status(201).json({ message: 'Product deleted' })
   } catch (error) {
      res.status(500).json({ message: 'Error deleting product' });
   }
}

export const updateProduct = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const { productId } = req.params
      const { name, stock } = req.body

      if (!name || !Array.isArray(stock)) {
         res.status(400).json({ message: 'Name and stock array are required' });
         return;
      }

      const updatedProduct = await prisma.products.update({
         where: {
            productId
         },
         data: {
            name,
            stock: {
               upsert: stock.map(({ stockId, size, quantity, price }) => ({
                  where: { stockId },
                  update: { size, quantity, price },
                  create: { size, quantity, price }
               }))
            }
         },
         include: {
            stock: true
         }
      })

      res.status(201).json(updatedProduct)
   } catch (error) {
      res.status(500).json({ message: 'Error updating product' });
   }
}

export const updateProductStock = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const { productId } = req.params;
      const { stock } = req.body; 

      const newStockItems = await prisma.$transaction(
         stock.map((item: any) =>
            prisma.productStock.create({
               data: {
                  productId,
                  price: item.price,
                  size: item.size,
                  quantity: item.quantity,
               },
            })
         )
      );

      res.status(200).json(newStockItems);
   } catch (error) {
      res.status(500).json({ error: 'Failed to add stock' });
   }
}