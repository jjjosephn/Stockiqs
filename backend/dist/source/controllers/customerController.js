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
exports.updateCustomer = exports.deleteCustomer = exports.createCustomer = exports.getCustomer = exports.getCustomers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield prisma.customers.findMany();
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving customers' });
    }
});
exports.getCustomers = getCustomers;
const getCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const customer = yield prisma.customers.findUnique({
            where: {
                customerId
            }
        });
        res.status(200).json(customer);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving customer' });
    }
});
exports.getCustomer = getCustomer;
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId, phoneNumber, name, instagram, streetAddress, city, state, zipCode } = req.body;
        const customer = yield prisma.customers.create({
            data: {
                customerId,
                name,
                phoneNumber,
                instagram,
                streetAddress,
                city,
                state,
                zipCode
            }
        });
        res.status(201).json({ message: 'User created', customer });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});
exports.createCustomer = createCustomer;
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        yield prisma.customers.delete({
            where: {
                customerId
            }
        });
        res.status(200).json({ message: 'User deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});
exports.deleteCustomer = deleteCustomer;
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const { phoneNumber, name, instagram, streetAddress, city, state, zipCode } = req.body;
        const customer = yield prisma.customers.update({
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
        });
        res.status(200).json({ message: 'User updated', customer });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
});
exports.updateCustomer = updateCustomer;
