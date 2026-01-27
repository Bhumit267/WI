import express from 'express';
import db, { schema } from './db';
import { count } from 'drizzle-orm';

const app = express();
const PORT = 4000;

app.get('/', async (req, res) => {
    try {
        const [result] = await db.select({ count: count() }).from(schema.users);
        res.json({ message: 'Server is running!', userCount: result.count });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
