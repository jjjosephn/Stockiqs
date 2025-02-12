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
exports.getPurchases = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPurchases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchases = yield prisma.purchases.findMany({
            include: {
                productStock: {
                    include: {
                        product: true,
                    },
                },
                psArchive: {
                    include: {
                        product: true,
                    },
                }
            }
        });
        res.json(purchases);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving purchases' });
    }
});
exports.getPurchases = getPurchases;
