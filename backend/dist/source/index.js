"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/* Route Imports */
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const salesRoutes_1 = __importDefault(require("./routes/salesRoutes"));
const purchasesRoutes_1 = __importDefault(require("./routes/purchasesRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const archiveRoutes_1 = __importDefault(require("./routes/archiveRoutes"));
/* Configs */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use((0, morgan_1.default)('common'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
/* Routes */
app.use('/products', productRoutes_1.default);
app.use('/customers', customerRoutes_1.default);
app.use('/sales', salesRoutes_1.default);
app.use('/purchases', purchasesRoutes_1.default);
app.use('/dashboard', userRoutes_1.default);
app.use('/archive', archiveRoutes_1.default);
/* Server */
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
