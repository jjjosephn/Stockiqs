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
exports.getProductsArchive = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProductsArchive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield prisma.productsArchive.count();
        console.log(`Found ${count} products in archive`);
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
