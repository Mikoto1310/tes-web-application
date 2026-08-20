import { getDb, run, queryAll } from './database.js';
import { products } from './products.js';

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
