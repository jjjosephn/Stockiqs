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
exports.updateProductStock = exports.updateProduct = exports.deleteProduct = exports.createProduct = exports.getProducts = void 0;
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
                stock: true
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
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
});
exports.createProduct = createProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        yield prisma.products.delete({
            where: {
                productId
            }
        });
        res.status(201).json({ message: 'Product deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});
exports.deleteProduct = deleteProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { name, stock } = req.body;
        if (!name || !Array.isArray(stock)) {
            res.status(400).json({ message: 'Name and stock array are required' });
            return;
        }
        const updatedProduct = yield prisma.products.update({
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
        });
        res.status(201).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
});
exports.updateProduct = updateProduct;
const updateProductStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { price, size, quantity } = req.body;
        const newStock = yield prisma.productStock.create({
            data: {
                productId,
                price,
                size,
                quantity,
            },
        });
        res.status(200).json(newStock);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add stock' });
    }
});
exports.updateProductStock = updateProductStock;
