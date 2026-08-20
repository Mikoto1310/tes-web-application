import { Router } from 'express';
import { getDb, queryAll, queryOne } from '../db/database.js';

const router = Router();

router.get('/', async (req, res) => {
  await getDb();
  const { search, category, page = 1, limit = 12 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let where = 'WHERE stock > 0';
  const params = [];

  if (search) {
    where += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }
  if (category && category !== 'all') {
    where += ' AND category = ?';
    params.push(category);
  }

  const countRow = queryOne(`SELECT COUNT(*) as total FROM products ${where}`, params);
  const products = queryAll(`SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), offset]);

  res.json({
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: countRow.total,
      totalPages: Math.ceil(countRow.total / parseInt(limit))
    }
  });
});

router.get('/categories', async (req, res) => {
  await getDb();
  const categories = queryAll('SELECT DISTINCT category FROM products ORDER BY category');
  res.json(categories.map(c => c.category));
});

router.get('/:id', async (req, res) => {
  await getDb();
  const product = queryOne('SELECT * FROM products WHERE id = ?', [parseInt(req.params.id)]);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

export default router;
