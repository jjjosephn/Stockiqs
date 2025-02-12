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
exports.getSales = exports.newSale = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const newSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { saleId, stockId, userId, quantity, salesPrice, timestamp } = req.body;
        if (quantity < 1) {
            res.status(400).json({ message: "Quantity must be at least 1" });
            return;
        }
        console.log('sale data', req.body);
        const sale = yield prisma.sales.create({
            data: {
                saleId,
                stockId,
                userId,
                quantity: parseInt(quantity),
                salesPrice: parseFloat(salesPrice),
                timestamp: new Date(timestamp)
            }
        });
        res.status(201).json(sale);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating sale' });
    }
});
exports.newSale = newSale;
const getSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield prisma.sales.findMany({
            include: {
                customers: true,
                productStock: {
                    include: {
                        product: true,
                    },
                },
                psArchive: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        res.status(200).json(sales);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving sales" });
    }
});
exports.getSales = getSales;
