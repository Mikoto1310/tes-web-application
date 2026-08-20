import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getDb, queryAll, queryOne, run } from '../server/db/database.js';

import authRoutes from '../server/routes/auth.js';
import productRoutes from '../server/routes/products.js';
import cartRoutes from '../server/routes/cart.js';
import orderRoutes from '../server/routes/orders.js';

const app = express();
const isProd = process.env.VERCEL;

app.use(cors({
  origin: isProd ? true : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

let dbInitialized = false;

async function ensureDb() {
  if (!dbInitialized) {
    await getDb();
    dbInitialized = true;
  }
}

app.use(async (req, res, next) => {
  try {
    await ensureDb();
    next();
  } catch (err) {
    console.error('DB init error:', err);
    res.status(500).json({ error: 'Database initialization failed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
