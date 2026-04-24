import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./sales_manager.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    createTables();
  }
});

// Create tables
function createTables() {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    customer_name TEXT,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  // Insert sample data
  insertSampleData();
}

function insertSampleData() {
  // Check if data already exists
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err || !row || row.count === 0) {
      const products = [
        { name: 'Laptop Dell', price: 1500, description: 'High-performance laptop' },
        { name: 'Mouse Logitech', price: 50, description: 'Wireless mouse' },
        { name: 'Keyboard Mechanical', price: 120, description: 'RGB mechanical keyboard' }
      ];

      products.forEach(product => {
        db.run(`INSERT INTO products (name, price, description) VALUES (?, ?, ?)`,
          [product.name, product.price, product.description]);
      });

      // Sample sales
      const sales = [
        { product_id: 1, quantity: 2, total_amount: 3000, customer_name: 'John Doe' },
        { product_id: 2, quantity: 5, total_amount: 250, customer_name: 'Jane Smith' }
      ];

      sales.forEach(sale => {
        db.run(`INSERT INTO sales (product_id, quantity, total_amount, customer_name) VALUES (?, ?, ?, ?)`,
          [sale.product_id, sale.quantity, sale.total_amount, sale.customer_name]);
      });
    }
  });
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new product
app.post('/api/products', (req, res) => {
  const { name, price, description } = req.body;
  db.run(`INSERT INTO products (name, price, description) VALUES (?, ?, ?)`,
    [name, price, description], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, price, description });
    });
});

// Get all sales
app.get('/api/sales', (req, res) => {
  const query = `
    SELECT s.*, p.name as product_name
    FROM sales s
    LEFT JOIN products p ON s.product_id = p.id
    ORDER BY s.sale_date DESC
  `;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new sale
app.post('/api/sales', (req, res) => {
  const { product_id, quantity, customer_name } = req.body;

  // Get product price
  db.get("SELECT price FROM products WHERE id = ?", [product_id], (err, product) => {
    if (err || !product) {
      res.status(500).json({ error: 'Product not found' });
      return;
    }

    const total_amount = product.price * quantity;
    db.run(`INSERT INTO sales (product_id, quantity, total_amount, customer_name) VALUES (?, ?, ?, ?)`,
      [product_id, quantity, total_amount, customer_name], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          id: this.lastID,
          product_id,
          quantity,
          total_amount,
          customer_name
        });
      });
  });
});

// Get dashboard stats
app.get('/api/dashboard', (req, res) => {
  const queries = {
    totalSales: "SELECT SUM(total_amount) as total FROM sales",
    totalProducts: "SELECT COUNT(*) as count FROM products",
    totalCustomers: "SELECT COUNT(DISTINCT customer_name) as count FROM sales WHERE customer_name IS NOT NULL"
  };

  const results = {};

  let completed = 0;
  const totalQueries = Object.keys(queries).length;

  Object.keys(queries).forEach(key => {
    db.get(queries[key], (err, row) => {
      if (err) {
        results[key] = 0;
      } else {
        results[key] = row[Object.keys(row)[0]] || 0;
      }
      completed++;
      if (completed === totalQueries) {
        res.json({
          totalSales: results.totalSales,
          totalProducts: results.totalProducts,
          totalCustomers: results.totalCustomers
        });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});