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
            stock: true,
            psArchive: true
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
      
      console.log(product)
      const purchases = await prisma.purchases.createMany({
         data: product.stock.map(({ stockId }) => ({
            stockId
         }))
      })

      res.status(201).json({product, purchases});
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

      const product = await prisma.products.findUnique({
         where: { productId }
      });

      if (!product) {
         res.status(404).json({ message: 'Product not found' });
         return;
      }

      const productArchive = await prisma.productsArchive.create({
         data: {
            productId: product.productId,
            name: product.name,
         }
      });

      const productStocks = await prisma.productStock.findMany({
         where: { productId }
      });

      for (const stock of productStocks) {
         const archivedStock = await prisma.pSArchive.create({
            data: {
               stockId: stock.stockId,
               price: stock.price,
               productId: stock.productId,
               size: stock.size,
               quantity: stock.quantity,
               productsArchiveId: productArchive.productsArchiveId
            }
         });

         await prisma.sales.updateMany({
            where: { stockId: stock.stockId },
            data: { 
               productsArchiveId: productArchive.productsArchiveId,
               archiveId: archivedStock.archiveId,
            }
         });
      }
      
      await prisma.productStock.deleteMany({ where: { productId } });
      await prisma.products.delete({ where: { productId } });

      res.status(201).json({ message: 'Product deleted' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting product' });
   }
};


export const getProductsArchive = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
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

export const deleteProductStock = async (
   req: Request, 
   res: Response
): Promise<void> => {
   try {
      const { productId, stockId } = req.params;

      const archiveStock = await prisma.productStock.findUnique({
         where: { stockId },
      });
      
      if (!archiveStock) {
         res.status(404).json({ message: 'Stock item not found' });
         return;
      }

      const archived = await prisma.pSArchive.create({
         data: {
            stockId: archiveStock.stockId,
            price: archiveStock.price,
            productId: archiveStock.productId,
            size: archiveStock.size,
            quantity: archiveStock.quantity
         }
      });

      await prisma.sales.updateMany({
         where: { stockId },
         data: {
            archiveId: archived.archiveId,  
            stockId: null,
         },
      });

      await prisma.productStock.delete({
         where: { stockId }
      });

      res.status(200).json({ message: 'Stock item deleted successfully', archived });
   } catch (error) {
      res.status(500).json({ error: 'Failed to delete stock item', details: error });
   }
};


export const updateProductStockAfterSale = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const {stockId} = req.params;
      const { quantity } = req.body;

      const updateStockItem = await prisma.productStock.update({
         where: {
            stockId
         },
         data: {
            quantity: {
               decrement: parseInt(quantity)
            }
         }
      });
      res.status(200).json(updateStockItem);

   } catch (error) {
      res.status(500).json({ message: 'Error updating stock' });
   }
}

export const deleteProductStockAfterSale = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const { stockId } = req.params;
      console.log('Archiving and deleting stock:', stockId);

      const stockToArchive = await prisma.productStock.findUnique({
         where: { stockId: stockId },
      });

      if (!stockToArchive) {
         res.status(404).json({ message: 'Stock item not found' });
         return;
      }

      const archivedStock = await prisma.pSArchive.create({
         data: {
            stockId: stockToArchive.stockId, 
            price: stockToArchive.price,
            productId: stockToArchive.productId,
            size: stockToArchive.size,
            quantity: stockToArchive.quantity,
         },
      });

      await prisma.sales.updateMany({
         where: { 
            stockId: stockId 
         },
         data: { 
            archiveId: archivedStock.archiveId, 
            stockId: null 
         },
      });

      await prisma.purchases.updateMany({
         where: { 
            stockId: stockId 
         },
         data: { 
            archiveId: archivedStock.archiveId, 
            stockId: null 
         },
      });

      await prisma.productStock.delete({
         where: { 
            stockId: stockId 
         },
      });

      res.status(200).json({ message: 'Stock item archived and deleted successfully' });
   } catch (error) {
      console.error('Error deleting stock:', error);
      res.status(500).json({ message: 'Error deleting stock' });
   }
}