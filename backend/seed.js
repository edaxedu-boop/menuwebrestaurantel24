const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const tsFilePath = path.join(__dirname, '../src/data/menu.ts');
const dbPath = path.join(__dirname, 'database.sqlite');

// 1. Read the TypeScript file
console.log('Reading menu.ts...');
let tsContent = fs.readFileSync(tsFilePath, 'utf8');

// 2. Convert TS to standard JS by stripping interfaces and type annotations
console.log('Converting TypeScript data to JavaScript...');
let jsContent = tsContent
  .replace(/export interface MenuItem [\s\S]*?\n\}/g, '')
  .replace(/export interface Category [\s\S]*?\n\}/g, '')
  .replace(/: Category\[\]/g, '')
  .replace(/: MenuItem\[\]/g, '')
  .replace(/export const/g, 'const');

// Append module.exports so we can require it
jsContent += '\nmodule.exports = { categories, menuItems };';

// Write to a temporary file
const tempFilePath = path.join(__dirname, 'temp-menu.js');
fs.writeFileSync(tempFilePath, jsContent, 'utf8');

// Require the parsed lists
const { categories, menuItems } = require(tempFilePath);
console.log(`Successfully loaded ${categories.length} categories and ${menuItems.length} menu items from menu.ts.`);

// 3. Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

db.serialize(() => {
  // Ensure tables exist
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE CASCADE
  )`);

  console.log('Seeding categories...');
  const stmtCat = db.prepare('INSERT OR REPLACE INTO categories (id, name, image) VALUES (?, ?, ?)');
  categories.forEach((cat) => {
    stmtCat.run(cat.id, cat.name, cat.image);
  });
  stmtCat.finalize();

  console.log('Seeding menu items...');
  const stmtItem = db.prepare('INSERT OR REPLACE INTO menu_items (id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)');
  menuItems.forEach((item) => {
    stmtItem.run(item.id, item.name, item.description || '', item.price, item.image, item.category);
  });
  stmtItem.finalize();

  console.log('Database successfully seeded!');
});

// Clean up temp file
db.close(() => {
  try {
    fs.unlinkSync(tempFilePath);
    console.log('Cleaned up temporary files.');
  } catch (e) {
    // ignore
  }
});
