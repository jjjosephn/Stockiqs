"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductStockAfterSale = exports.updateProductStockAfterSale = exports.deleteProductStock = exports.updateProductStock = exports.updateProduct = exports.getProductsArchive = exports.deleteProduct = exports.createProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const products = yield prisma.products.findMany({
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
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving products' });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, stock } = req.body;
        if (!name || !Array.isArray(stock)) {
            res.status(400).json({ message: 'Name and stock array are required' });
            return;
        }
        const product = yield prisma.products.create({
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
        console.log(product);
        const purchases = yield prisma.purchases.createMany({
            data: product.stock.map(({ stockId }) => ({
                stockId
            }))
        });
        res.status(201).json({ product, purchases });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
});
exports.createProduct = createProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const product = yield prisma.products.findUnique({
            where: { productId }
        });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        const productArchive = yield prisma.productsArchive.create({
            data: {
                productId: product.productId,
                name: product.name,
            }
        });
        const productStocks = yield prisma.productStock.findMany({
            where: { productId }
        });
        for (const stock of productStocks) {
            const archivedStock = yield prisma.pSArchive.create({
                data: {
                    stockId: stock.stockId,
                    price: stock.price,
                    productId: stock.productId,
                    size: stock.size,
                    quantity: stock.quantity,
                    productsArchiveId: productArchive.productsArchiveId
                }
            });
            yield prisma.sales.updateMany({
                where: { stockId: stock.stockId },
                data: {
                    productsArchiveId: productArchive.productsArchiveId,
                    archiveId: archivedStock.archiveId,
                }
            });
            yield prisma.purchases.updateMany({
                where: { stockId: stock.stockId },
                data: {
                    archiveId: archivedStock.archiveId,
                }
            });
        }
        yield prisma.productStock.deleteMany({ where: { productId } });
        yield prisma.products.delete({ where: { productId } });
        res.status(201).json({ message: 'Product deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});
exports.deleteProduct = deleteProduct;
const getProductsArchive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsArchive = yield prisma.productsArchive.findMany({
            include: {
                psArchive: true
            }
        });
        res.json(productsArchive);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving products archive' });
    }
});
exports.getProductsArchive = getProductsArchive;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { name, stock } = req.body;
        if (!name || !Array.isArray(stock)) {
            res.status(400).json({ message: 'Name and stock array are required' });
            return;
        }
        const existingStockIds = new Set((yield prisma.productStock.findMany({
            where: { productId },
            select: { stockId: true }
        })).map(stock => stock.stockId));
        const upsertedStock = yield Promise.all(stock.map((_a) => __awaiter(void 0, [_a], void 0, function* ({ stockId, size, quantity, price }) {
            const createdStock = yield prisma.productStock.upsert({
                where: { stockId },
                update: { size, quantity, price },
                create: { size, quantity, price, productId }
            });
            return createdStock;
        })));
        const newStock = upsertedStock.filter(({ stockId }) => !existingStockIds.has(stockId));
        if (newStock.length > 0) {
            yield prisma.purchases.createMany({
                data: newStock.map(({ stockId }) => ({ stockId }))
            });
        }
        const updatedProduct = yield prisma.products.findUnique({
            where: { productId },
            include: { stock: true }
        });
        res.status(201).json(updatedProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
});
exports.updateProduct = updateProduct;
const updateProductStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { stock } = req.body;
        const newStockItems = yield prisma.$transaction(stock.map((item) => prisma.productStock.create({
            data: {
                productId,
                price: item.price,
                size: item.size,
                quantity: item.quantity,
            },
        })));
        res.status(200).json(newStockItems);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add stock' });
    }
});
exports.updateProductStock = updateProductStock;
const deleteProductStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, stockId } = req.params;
        const archiveStock = yield prisma.productStock.findUnique({
            where: { stockId },
        });
        if (!archiveStock) {
            res.status(404).json({ message: 'Stock item not found' });
            return;
        }
        const archived = yield prisma.pSArchive.create({
            data: {
                stockId: archiveStock.stockId,
                price: archiveStock.price,
                productId: archiveStock.productId,
                size: archiveStock.size,
                quantity: archiveStock.quantity
            }
        });
        yield prisma.sales.updateMany({
            where: { stockId },
            data: {
                archiveId: archived.archiveId,
                stockId: null,
            },
        });
        yield prisma.purchases.updateMany({
            where: { stockId },
            data: {
                archiveId: archived.archiveId,
                stockId: null,
            },
        });
        yield prisma.productStock.delete({
            where: { stockId }
        });
        res.status(200).json({ message: 'Stock item deleted successfully', archived });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete stock item', details: error });
    }
});
exports.deleteProductStock = deleteProductStock;
const updateProductStockAfterSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stockId } = req.params;
        const { quantity } = req.body;
        const updateStockItem = yield prisma.productStock.update({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating stock' });
    }
});
exports.updateProductStockAfterSale = updateProductStockAfterSale;
const deleteProductStockAfterSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stockId } = req.params;
        console.log('Archiving and deleting stock:', stockId);
        const stockToArchive = yield prisma.productStock.findUnique({
            where: { stockId: stockId },
        });
        if (!stockToArchive) {
            res.status(404).json({ message: 'Stock item not found' });
            return;
        }
        const archivedStock = yield prisma.pSArchive.create({
            data: {
                stockId: stockToArchive.stockId,
                price: stockToArchive.price,
                productId: stockToArchive.productId,
                size: stockToArchive.size,
                quantity: stockToArchive.quantity,
            },
        });
        yield prisma.sales.updateMany({
            where: {
                stockId: stockId
            },
            data: {
                archiveId: archivedStock.archiveId,
                stockId: null
            },
        });
        yield prisma.purchases.updateMany({
            where: {
                stockId: stockId
            },
            data: {
                archiveId: archivedStock.archiveId,
                stockId: null
            },
        });
        yield prisma.productStock.delete({
            where: {
                stockId: stockId
            },
        });
        res.status(200).json({ message: 'Stock item archived and deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting stock:', error);
        res.status(500).json({ message: 'Error deleting stock' });
    }
});
exports.deleteProductStockAfterSale = deleteProductStockAfterSale;
