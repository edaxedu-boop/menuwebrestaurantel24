const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const AUTH_TOKEN = 'el24_admin_secure_token_secret_123'; // Simple static token for admin

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database.');
    db.run('PRAGMA journal_mode=WAL');
    createTables();
  }
});

// Configure Multer for image uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'));
  }
});

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Create tables if they do not exist
function createTables() {
  db.serialize(() => {
    // Categories Table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT NOT NULL
    )`);

    // Menu Items Table
    db.run(`CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      FOREIGN KEY (category) REFERENCES categories(id) ON DELETE CASCADE
    )`);

    // Users Table for Login
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`, () => {
      // Seed default admin user: admin@el24.com / admin
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('admin', salt);
      db.run('INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)', ['admin@el24.com', hash]);
    });
  });
}

// Middleware to protect admin routes
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === `Bearer ${AUTH_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: 'No autorizado' });
  }
};

// --- AUTH ENDPOINTS ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan credenciales' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (isMatch) {
      res.json({ token: AUTH_TOKEN, message: 'Login exitoso' });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  });
});

// --- IMAGE UPLOAD ENDPOINT ---
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }
  // Public URL pointing to our reverse-proxied Nginx server
  const imageUrl = `https://restaurantel24.duckdns.org/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// --- CATEGORIES ENDPOINTS ---
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/categories', requireAuth, (req, res) => {
  const { name, image } = req.body;
  if (!name || !image) {
    return res.status(400).json({ error: 'Nombre e imagen son requeridos' });
  }

  const id = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
  
  db.run('INSERT OR REPLACE INTO categories (id, name, image) VALUES (?, ?, ?)', [id, name, image], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, name, image });
  });
});

app.delete('/api/categories/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM categories WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Categoría eliminada con éxito', deletedId: id });
  });
});

// --- MENU ITEMS ENDPOINTS ---
app.get('/api/menu', (req, res) => {
  db.all('SELECT * FROM menu_items', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/menu', requireAuth, (req, res) => {
  const { name, price, image, category } = req.body;
  if (!name || price === undefined || !image || !category) {
    return res.status(400).json({ error: 'Campos inválidos' });
  }

  const id = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_') + '_' + Date.now();
  const description = '';

  db.run('INSERT INTO menu_items (id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)', 
    [id, name, description, parseFloat(price), image, category], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, name, description, price: parseFloat(price), image, category });
  });
});

app.delete('/api/menu/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM menu_items WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Plato eliminado con éxito', deletedId: id });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
