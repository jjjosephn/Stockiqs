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
exports.createCustomer = exports.getCustomers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield prisma.users.findMany();
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving users' });
    }
});
exports.getCustomers = getCustomers;
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name, email } = req.body;
        const customer = yield prisma.users.create({
            data: {
                userId,
                name,
                email
            }
        });
        res.status(201).json({ message: 'User created', customer });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});
exports.createCustomer = createCustomer;
