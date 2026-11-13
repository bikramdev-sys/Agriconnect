import fs from 'fs';
import path from 'path';

const map = {
  'Ramesh Patel': '/avatars/ramesh-patel.jpg',
  'Rameshwar Patil': '/avatars/ramesh-patel.jpg',
  'Lakshmi Devi': '/avatars/lakshmi-devi.jpg',
  'Lakshmi Narayanan': '/avatars/lakshmi-devi.jpg',
  'Gurpreet Singh': '/avatars/gurpreet-singh.jpg',
  'Suresh Kumar': '/avatars/suresh-kumar.jpg',
  'Ananya Sharma': '/avatars/ananya-sharma.jpg'
};

// 1. Update src/data/products.js
const prodFile = path.resolve('src/data/products.js');
let prodCode = fs.readFileSync(prodFile, 'utf8');
for (const [name, avatar] of Object.entries(map)) {
  const targetRegex = new RegExp(`(farmerName:\\s*['"]` + name.replace(/ /g, '\\s+') + `['"],\\s*farmerAvatar:\\s*['"])[^'"]+(['"])`, 'g');
  prodCode = prodCode.replace(targetRegex, `$1${avatar}$2`);
}
fs.writeFileSync(prodFile, prodCode, 'utf8');
console.log('Updated src/data/products.js');

// 2. Update src/data/testimonials.js
const testFile = path.resolve('src/data/testimonials.js');
let testCode = fs.readFileSync(testFile, 'utf8');
testCode = testCode.replace(/(name:\s*['"]Ramesh Patel['"],[\s\S]*?avatar:\s*['"])[^'"]+(['"])/g, `$1/avatars/ramesh-patel.jpg$2`);
fs.writeFileSync(testFile, testCode, 'utf8');
console.log('Updated src/data/testimonials.js');

// 3. Update server/data/db.json
const dbFile = path.resolve('server/data/db.json');
if (fs.existsSync(dbFile)) {
  const db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

  // Update farmers
  if (Array.isArray(db.farmers)) {
    db.farmers.forEach(f => {
      if (map[f.name]) {
        f.avatar = map[f.name];
      }
    });
  }

  // Update products
  if (Array.isArray(db.products)) {
    db.products.forEach(p => {
      if (map[p.farmerName]) {
        p.farmerAvatar = map[p.farmerName];
      }
    });
  }

  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf8');
  console.log('Updated server/data/db.json');
}

