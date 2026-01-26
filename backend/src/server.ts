import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes Placeholder
app.get('/', (req: Request, res: Response) => {
    res.send('OpenFare API is running');
});

// Mock Partner API
app.get('/mock/redbus/tickets/:pnr', (req: Request, res: Response) => {
    const { pnr } = req.params;
    // TODO: Implement mock logic
    res.json({ pnr, status: 'MOCK_DATA' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
