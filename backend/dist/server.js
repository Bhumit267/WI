"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true // Allow cookies
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.get('/', (req, res) => {
    res.send('OpenFare API is running');
});
// Auth routes
app.use('/api/auth', auth_1.default);
// User routes
app.use('/api/user', user_1.default);
// Mock Partner API
app.get('/mock/redbus/tickets/:pnr', (req, res) => {
    const { pnr } = req.params;
    // TODO: Implement mock logic
    res.json({ pnr, status: 'MOCK_DATA' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
