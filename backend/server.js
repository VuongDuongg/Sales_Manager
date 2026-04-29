import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
    credentials: true
  }
});

const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

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
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    category_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id)
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
  { name: 'Laptop Dell XPS 13', price: 1299, description: 'Ultra-portable laptop with powerful performance', category: 'Laptops' },
  { name: 'Laptop HP Pavilion', price: 799, description: 'Reliable laptop for everyday computing', category: 'Laptops' },
  { name: 'Laptop Lenovo ThinkPad', price: 1100, description: 'Business-grade laptop with long battery life', category: 'Laptops' },
  { name: 'Monitor LG 27"', price: 350, description: '4K UHD display for professional work', category: 'Monitors' },
  { name: 'Monitor Dell 24"', price: 250, description: 'Full HD monitor perfect for office', category: 'Monitors' },
  { name: 'Mouse Logitech MX Master', price: 99, description: 'Advanced wireless mouse for productivity', category: 'Accessories' },
  { name: 'Mouse Razer DeathAdder', price: 70, description: 'Gaming mouse with precision tracking', category: 'Accessories' },
  { name: 'Mouse Microsoft Pro', price: 45, description: 'Ergonomic wireless mouse', category: 'Accessories' },
  { name: 'Keyboard Mechanical Cherry', price: 150, description: 'Premium mechanical keyboard with RGB', category: 'Accessories' },
  { name: 'Keyboard Logitech K840', price: 120, description: 'Mechanical gaming keyboard', category: 'Accessories' },
  { name: 'Keyboard Apple Magic', price: 299, description: 'Wireless keyboard for Mac', category: 'Accessories' },
  { name: 'Webcam Logitech C920', price: 85, description: '1080p HD webcam for video calls', category: 'Accessories' },
  { name: 'Webcam Razer Kiyo', price: 100, description: 'Streaming webcam with auto focus', category: 'Accessories' },
  { name: 'Headphones Sony WH-1000', price: 350, description: 'Noise-cancelling wireless headphones', category: 'Audio' },
  { name: 'Headphones Apple AirPods Pro', price: 249, description: 'Premium wireless earbuds', category: 'Audio' },
  { name: 'Headphones Logitech G Pro', price: 129, description: 'Gaming headset with surround sound', category: 'Audio' },
  { name: 'SSD Samsung 970 Evo', price: 120, description: '500GB NVMe SSD for speed', category: 'Storage' },
  { name: 'SSD WD Blue 1TB', price: 150, description: '1TB solid state drive', category: 'Storage' },
  { name: 'Graphics Card RTX 3060', price: 400, description: 'NVIDIA graphics card for gaming', category: 'Components' },
  { name: 'RAM DDR4 16GB', price: 80, description: 'High-speed memory for multitasking', category: 'Components' },
  { name: 'Power Supply 750W', price: 100, description: 'Gold-rated power supply', category: 'Components' },
  { name: 'CPU Cooler Noctua', price: 90, description: 'Quiet and efficient CPU cooler', category: 'Components' },
  { name: 'USB-C Hub Anker', price: 40, description: '7-in-1 USB-C hub with multiple ports', category: 'Accessories' },
  { name: 'Docking Station Lenovo', price: 180, description: 'Universal docking station for laptops', category: 'Accessories' },
  { name: 'Monitor Arm Ergotron', price: 180, description: 'VESA mount monitor arm for desks', category: 'Accessories' }
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
      
      // Insert categories first
      const categories = ['Laptops', 'Monitors', 'Accessories', 'Audio', 'Storage', 'Components'];
      categories.forEach(category => {
        db.run(`INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)`,
          [category, `Category for ${category.toLowerCase()}`]);
      });

      // Insert products after categories
      setTimeout(() => {
        productTemplates.forEach(product => {
          db.get("SELECT id FROM categories WHERE name = ?", [product.category], (err, cat) => {
            if (cat) {
              db.run(`INSERT INTO products (name, price, description, category_id) VALUES (?, ?, ?, ?)`,
                [product.name, product.price, product.description, cat.id]);
            }
          });
        });
      }, 100);

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

// Get all categories
app.get('/api/categories', (req, res) => {
  db.all("SELECT * FROM categories ORDER BY name", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new category
app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  db.run(`INSERT INTO categories (name, description) VALUES (?, ?)`,
    [name, description], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const newCategory = { id: this.lastID, name, description };
      io.emit('categoryAdded', newCategory); // Emit real-time update
      res.json(newCategory);
    });
});

// Update category
app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.run(
    `UPDATE categories SET name = ?, description = ? WHERE id = ?`,
    [name, description, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const updatedCategory = { id: parseInt(id), name, description };
      io.emit('categoryUpdated', updatedCategory); // Emit real-time update
      res.json(updatedCategory);
    }
  );
});

// Delete category
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM categories WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    io.emit('categoryDeleted', { id: parseInt(id) }); // Emit real-time update
    res.json({ success: true, id: parseInt(id) });
  });
});

// Get all products
app.get('/api/products', (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new product
app.post('/api/products', (req, res) => {
  const { name, price, description, category_id } = req.body;
  db.run(`INSERT INTO products (name, price, description, category_id) VALUES (?, ?, ?, ?)`,
    [name, price, description, category_id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const newProduct = { id: this.lastID, name, price, description, category_id };
      io.emit('productAdded', newProduct); // Emit real-time update
      res.json(newProduct);
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
        const newSale = {
          id: this.lastID,
          product_id,
          quantity,
          total_amount,
          customer_name
        };
        io.emit('saleAdded', newSale); // Emit real-time update
        res.json(newSale);
      });
  });
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, description, category_id } = req.body;
  db.run(
    `UPDATE products SET name = ?, price = ?, description = ?, category_id = ? WHERE id = ?`,
    [name, price, description, category_id, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const updatedProduct = { id: parseInt(id), name, price, description, category_id };
      io.emit('productUpdated', updatedProduct); // Emit real-time update
      res.json(updatedProduct);
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
    io.emit('productDeleted', { id: parseInt(id) }); // Emit real-time update
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
        const updatedSale = {
          id: parseInt(id),
          product_id,
          quantity,
          total_amount,
          customer_name
        };
        io.emit('saleUpdated', updatedSale); // Emit real-time update
        res.json(updatedSale);
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
    io.emit('saleDeleted', { id: parseInt(id) }); // Emit real-time update
    res.json({ success: true, id: parseInt(id) });
  });
});

// Get dashboard stats
app.get('/api/dashboard', (req, res) => {
  const queries = {
    totalSales: "SELECT SUM(total_amount) as total FROM sales",
    totalProducts: "SELECT COUNT(*) as count FROM products",
    totalCustomers: "SELECT COUNT(DISTINCT customer_name) as count FROM sales WHERE customer_name IS NOT NULL",
    totalCategories: "SELECT COUNT(*) as count FROM categories",
    averageSale: "SELECT AVG(total_amount) as avg FROM sales",
    recentSales: "SELECT COUNT(*) as count FROM sales WHERE sale_date >= datetime('now', '-7 days')",
    topCategory: `
      SELECT c.name as category_name, SUM(s.total_amount) as revenue
      FROM sales s
      LEFT JOIN products p ON s.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.name IS NOT NULL
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
      LIMIT 1
    `,
    totalTransactions: "SELECT COUNT(*) as count FROM sales"
  };

  const results = {};

  let completed = 0;
  const totalQueries = Object.keys(queries).length;

  Object.keys(queries).forEach(key => {
    db.get(queries[key], (err, row) => {
      if (err) {
        results[key] = key === 'topCategory' ? { category_name: 'N/A', revenue: 0 } : 0;
      } else {
        if (key === 'topCategory') {
          results[key] = row || { category_name: 'N/A', revenue: 0 };
        } else {
          results[key] = row[Object.keys(row)[0]] || 0;
        }
      }
      completed++;
      if (completed === totalQueries) {
        res.json({
          totalSales: results.totalSales,
          totalProducts: results.totalProducts,
          totalCustomers: results.totalCustomers,
          totalCategories: results.totalCategories,
          averageSale: results.averageSale,
          recentSales: results.recentSales,
          topCategory: results.topCategory,
          totalTransactions: results.totalTransactions
        });
      }
    });
  });
});

server.listen(PORT, () => {
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