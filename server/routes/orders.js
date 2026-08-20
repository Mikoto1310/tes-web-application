import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getDb, queryAll, queryOne, run } from '../db/database.js';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  await getDb();
  const orders = queryAll('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json({ orders });
});

router.get('/:id', authMiddleware, async (req, res) => {
  await getDb();
  const order = queryOne('SELECT * FROM orders WHERE id = ? AND user_id = ?', [parseInt(req.params.id), req.user.id]);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const items = queryAll(`
    SELECT oi.*, p.name, p.image_url
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `, [order.id]);

  res.json({ order, items });
});

router.post('/', authMiddleware, async (req, res) => {
  await getDb();
  const { shipping_name, shipping_address, shipping_city, shipping_zip, shipping_phone } = req.body;

  if (!shipping_name || !shipping_address || !shipping_city || !shipping_zip || !shipping_phone) {
    return res.status(400).json({ error: 'All shipping fields are required' });
  }

  const cartItems = queryAll(`
    SELECT ci.*, p.price, p.stock, p.name
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `, [req.user.id]);

  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  for (const item of cartItems) {
    if (item.quantity > item.stock) {
      return res.status(400).json({ error: `"${item.name}" only has ${item.stock} items in stock` });
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 5.99;
  const total = Math.round((totalPrice + shippingCost) * 100) / 100;

  try {
    const orderResult = run(`
      INSERT INTO orders (user_id, total_price, shipping_name, shipping_address, shipping_city, shipping_zip, shipping_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [req.user.id, total, shipping_name, shipping_address, shipping_city, shipping_zip, shipping_phone]);

    const orderId = orderResult.lastInsertRowid;

    for (const item of cartItems) {
      run('INSERT INTO order_items (order_id, product_id, quantity, price_at_buy) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]);
      run('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    run('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    res.json({ orderId, total, message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

export default router;
