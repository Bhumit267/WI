import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('OpenFare API is running');
});

// Auth routes
app.use('/api/auth', authRoutes);
// User routes
app.use('/api/user', userRoutes);

// Mock Partner API
app.get('/mock/redbus/tickets/:pnr', (req: Request, res: Response) => {
    const { pnr } = req.params;
    // TODO: Implement mock logic
    res.json({ pnr, status: 'MOCK_DATA' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
