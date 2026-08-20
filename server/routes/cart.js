import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getDb, queryAll, queryOne, run } from '../db/database.js';

const router = Router();

function getCartItems(userId) {
  return queryAll(`
    SELECT ci.id, ci.quantity, ci.product_id,
           p.name, p.price, p.image_url, p.stock
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
    ORDER BY ci.id DESC
  `, [userId]);
}

function getCartTotal(userId) {
  const items = getCartItems(userId);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items, total: Math.round(total * 100) / 100 };
}

router.get('/', authMiddleware, async (req, res) => {
  await getDb();
  res.json(getCartTotal(req.user.id));
});

router.post('/', authMiddleware, async (req, res) => {
  await getDb();
  const { product_id, quantity = 1 } = req.body;

  const product = queryOne('SELECT * FROM products WHERE id = ?', [product_id]);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = queryOne('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);

  if (existing) {
    const newQty = Math.min(existing.quantity + quantity, product.stock);
    run('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing.id]);
  } else {
    const qty = Math.min(quantity, product.stock);
    run('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, product_id, qty]);
  }

  res.json(getCartTotal(req.user.id));
});

router.patch('/:productId', authMiddleware, async (req, res) => {
  await getDb();
  const { quantity } = req.body;
  const productId = parseInt(req.params.productId);

  if (quantity <= 0) {
    run('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.id, productId]);
  } else {
    const product = queryOne('SELECT stock FROM products WHERE id = ?', [productId]);
    const safeQty = product ? Math.min(quantity, product.stock) : quantity;
    run('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?', [safeQty, req.user.id, productId]);
  }

  res.json(getCartTotal(req.user.id));
});

router.delete('/:productId', authMiddleware, async (req, res) => {
  await getDb();
  run('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.id, parseInt(req.params.productId)]);
  res.json(getCartTotal(req.user.id));
});

router.delete('/', authMiddleware, async (req, res) => {
  await getDb();
  run('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
  res.json({ items: [], total: 0 });
});

router.post('/merge', authMiddleware, async (req, res) => {
  await getDb();
  const { guestItems } = req.body;
  if (!Array.isArray(guestItems)) {
    return res.status(400).json({ error: 'guestItems must be an array' });
  }

  for (const item of guestItems) {
    const product = queryOne('SELECT stock FROM products WHERE id = ?', [item.product_id]);
    if (!product) continue;

    const existing = queryOne('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.id, item.product_id]);
    if (existing) {
      const newQty = Math.min(existing.quantity + item.quantity, product.stock);
      run('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing.id]);
    } else {
      const qty = Math.min(item.quantity, product.stock);
      run('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, item.product_id, qty]);
    }
  }

  res.json(getCartTotal(req.user.id));
});

export default router;
