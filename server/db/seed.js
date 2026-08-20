import { getDb, run, queryAll } from './database.js';

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Features active noise cancellation, comfortable over-ear design, and crystal-clear audio quality.',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    stock: 25,
    category: 'electronics'
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches. Full-size layout with numpad, programmable macro keys, and detachable USB-C cable.',
    price: 64.99,
    image_url: 'https://images.unsplash.com/photo-1541140532154-b024d7d0b27f?w=400&h=400&fit=crop',
    stock: 30,
    category: 'electronics'
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight breathable running shoes with responsive cushioning. Ideal for daily jogs and marathon training.',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    stock: 40,
    category: 'sports'
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable 12-cup coffee maker with built-in grinder. Brew fresh coffee every morning with adjustable strength settings.',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop',
    stock: 15,
    category: 'kitchen'
  },
  {
    name: 'Backpack',
    description: 'Durable waterproof travel backpack with 40L capacity. Features padded laptop compartment and multiple organizer pockets.',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    stock: 50,
    category: 'accessories'
  },
  {
    name: 'Desk Lamp',
    description: 'LED desk lamp with wireless charging base. Touch control with 5 brightness levels and 3 color temperatures.',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=400&h=400&fit=crop',
    stock: 35,
    category: 'home'
  },
  {
    name: 'Smartwatch',
    description: 'Feature-rich smartwatch with heart rate monitor, GPS tracking, and 7-day battery life. Water-resistant up to 50m.',
    price: 149.99,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    stock: 20,
    category: 'electronics'
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip eco-friendly yoga mat with alignment lines. 6mm thick for optimal cushioning. Includes carrying strap.',
    price: 29.99,
    image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
    stock: 60,
    category: 'sports'
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof Bluetooth speaker with 360-degree sound. 20-hour playtime and rugged design for outdoor adventures.',
    price: 59.99,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    stock: 45,
    category: 'electronics'
  },
  {
    name: 'Plant Pot Set',
    description: 'Set of 3 minimalist ceramic plant pots with bamboo trays. Perfect for succulents and small indoor plants.',
    price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
    stock: 28,
    category: 'home'
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI (800-4000). Silent click buttons and USB-C rechargeable.',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    stock: 55,
    category: 'electronics'
  },
  {
    name: 'Water Bottle',
    description: 'Insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free.',
    price: 19.99,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    stock: 70,
    category: 'accessories'
  }
];

async function seed() {
  const db = await getDb();

  db.run('DELETE FROM products');

  const insert = db.prepare('INSERT INTO products (name, description, price, image_url, stock, category) VALUES (?, ?, ?, ?, ?, ?)');

  for (const p of products) {
    insert.run([p.name, p.description, p.price, p.image_url, p.stock, p.category]);
  }

  insert.free();

  const { saveDb } = await import('./database.js');
  saveDb();

  console.log(`Seeded ${products.length} products`);
}

seed().catch(console.error);
