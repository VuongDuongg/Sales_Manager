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

// Product templates
const productTemplates = [
  { name: 'Laptop Dell XPS 13', price: 1299, description: 'Ultra-portable laptop with powerful performance' },
  { name: 'Laptop HP Pavilion', price: 799, description: 'Reliable laptop for everyday computing' },
  { name: 'Laptop Lenovo ThinkPad', price: 1100, description: 'Business-grade laptop with long battery life' },
  { name: 'Monitor LG 27"', price: 350, description: '4K UHD display for professional work' },
  { name: 'Monitor Dell 24"', price: 250, description: 'Full HD monitor perfect for office' },
  { name: 'Mouse Logitech MX Master', price: 99, description: 'Advanced wireless mouse for productivity' },
  { name: 'Mouse Razer DeathAdder', price: 70, description: 'Gaming mouse with precision tracking' },
  { name: 'Mouse Microsoft Pro', price: 45, description: 'Ergonomic wireless mouse' },
  { name: 'Keyboard Mechanical Cherry', price: 150, description: 'Premium mechanical keyboard with RGB' },
  { name: 'Keyboard Logitech K840', price: 120, description: 'Mechanical gaming keyboard' },
  { name: 'Keyboard Apple Magic', price: 299, description: 'Wireless keyboard for Mac' },
  { name: 'Webcam Logitech C920', price: 85, description: '1080p HD webcam for video calls' },
  { name: 'Webcam Razer Kiyo', price: 100, description: 'Streaming webcam with auto focus' },
  { name: 'Headphones Sony WH-1000', price: 350, description: 'Noise-cancelling wireless headphones' },
  { name: 'Headphones Apple AirPods Pro', price: 249, description: 'Premium wireless earbuds' },
  { name: 'Headphones Logitech G Pro', price: 129, description: 'Gaming headset with surround sound' },
  { name: 'SSD Samsung 970 Evo', price: 120, description: '500GB NVMe SSD for speed' },
  { name: 'SSD WD Blue 1TB', price: 150, description: '1TB solid state drive' },
  { name: 'Graphics Card RTX 3060', price: 400, description: 'NVIDIA graphics card for gaming' },
  { name: 'RAM DDR4 16GB', price: 80, description: 'High-speed memory for multitasking' },
  { name: 'Power Supply 750W', price: 100, description: 'Gold-rated power supply' },
  { name: 'CPU Cooler Noctua', price: 90, description: 'Quiet and efficient CPU cooler' },
  { name: 'USB-C Hub Anker', price: 40, description: '7-in-1 USB-C hub with multiple ports' },
  { name: 'Docking Station Lenovo', price: 180, description: 'Universal docking station for laptops' },
  { name: 'Monitor Arm Ergotron', price: 180, description: 'VESA mount monitor arm for desks' }
];

// Customer names
const customerNames = [
  'John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Brown', 'David Wilson',
  'Sarah Davis', 'Robert Miller', 'Lisa Anderson', 'James Taylor', 'Jennifer Garcia',
  'William Martinez', 'Mary Robinson', 'Charles Rodriguez', 'Patricia Lee', 'Christopher Lee',
  'Barbara Harris', 'Daniel White', 'Nancy Martin', 'Mark Thompson', 'Katherine Moore'
];

function insertSampleData() {
  // Check if data already exists
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err || !row || row.count === 0) {
      console.log('Generating sample data...');
      
      // Insert products
      productTemplates.forEach(product => {
        db.run(`INSERT INTO products (name, price, description) VALUES (?, ?, ?)`,
          [product.name, product.price, product.description]);
      });

      // Generate sales data with varying dates over past 30 days
      setTimeout(() => {
        db.all("SELECT id FROM products", (err, products) => {
          if (err || !products || products.length === 0) {
            console.log('No products found, skipping sales generation');
            return;
          }

          // Generate 100+ random sales records
          for (let i = 0; i < 150; i++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const randomCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];
            const quantity = Math.floor(Math.random() * 10) + 1;
            
            // Get product price for accurate total
            db.get("SELECT price FROM products WHERE id = ?", [randomProduct.id], (err, product) => {
              if (product) {
                const totalAmount = product.price * quantity;
                
                // Random date within last 30 days
                const daysAgo = Math.floor(Math.random() * 30);
                const hoursAgo = Math.floor(Math.random() * 24);
                const date = new Date();
                date.setDate(date.getDate() - daysAgo);
                date.setHours(date.getHours() - hoursAgo);
                const saleDate = date.toISOString();
                
                db.run(
                  `INSERT INTO sales (product_id, quantity, total_amount, customer_name, sale_date) 
                   VALUES (?, ?, ?, ?, ?)`,
                  [randomProduct.id, quantity, totalAmount, randomCustomer, saleDate]
                );
              }
            });
          }

          console.log('Sample data generated successfully!');
        });
      }, 500);
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

// Update product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  db.run(
    `UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?`,
    [name, price, description, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: parseInt(id), name, price, description });
    }
  );
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM products WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, id: parseInt(id) });
  });
});

// Update sale
app.put('/api/sales/:id', (req, res) => {
  const { id } = req.params;
  const { product_id, quantity, customer_name } = req.body;

  // Get product price
  db.get("SELECT price FROM products WHERE id = ?", [product_id], (err, product) => {
    if (err || !product) {
      res.status(500).json({ error: 'Product not found' });
      return;
    }

    const total_amount = product.price * quantity;
    db.run(
      `UPDATE sales SET product_id = ?, quantity = ?, total_amount = ?, customer_name = ? WHERE id = ?`,
      [product_id, quantity, total_amount, customer_name, id],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          id: parseInt(id),
          product_id,
          quantity,
          total_amount,
          customer_name
        });
      }
    );
  });
});

// Delete sale
app.delete('/api/sales/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM sales WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, id: parseInt(id) });
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