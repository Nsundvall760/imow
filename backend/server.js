const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://imow-frontend.onrender.com', 'https://imow-frontend-*.onrender.com'] 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setup lowdb
const dbFile = path.join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { builds: [] }); // Set default data here

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${nanoid(12)}${ext}`);
  }
});
const upload = multer({ storage });

// Initialize DB with builds array if not present
async function initDB() {
  await db.read();
  db.data ||= { builds: [] };
  await db.write();
}

initDB();

// Admin password (simple for MVP)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'im0wsecret';

// List all builds
app.get('/api/builds', async (req, res) => {
  await db.read();
  res.json(db.data.builds);
});

// Upload a new build (admin only)
app.post('/api/builds', upload.single('image'), async (req, res) => {
  console.log('UPLOAD DEBUG:', req.body, req.file);
  const { title, description, tags, category } = req.body;
  if (!req.file || !title || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  await db.read();
  const build = {
    id: nanoid(10),
    title,
    description: description || '',
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    image: `/uploads/${req.file.filename}`,
    category,
    createdAt: new Date().toISOString()
  };
  db.data.builds.unshift(build);
  await db.write();
  res.json(build);
});

// Update an existing build (admin only)
app.patch('/api/builds/:id', upload.single('image'), async (req, res) => {
  const { title, description, tags, category } = req.body;
  await db.read();
  const build = db.data.builds.find(b => b.id === req.params.id);
  if (!build) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(404).json({ error: 'Build not found' });
  }
  if (title !== undefined) build.title = title;
  if (description !== undefined) build.description = description;
  if (tags !== undefined) build.tags = tags ? tags.split(',').map(t => t.trim()) : [];
  if (category !== undefined) build.category = category;
  if (req.file) {
    // Remove old image file if exists
    if (build.image && fs.existsSync(path.join(__dirname, build.image))) {
      fs.unlinkSync(path.join(__dirname, build.image));
    }
    build.image = `/uploads/${req.file.filename}`;
  }
  await db.write();
  res.json(build);
});

// Delete a build (admin only)
app.delete('/api/builds/:id', async (req, res) => {
  await db.read();
  console.log('DELETE DEBUG: requested id:', req.params.id);
  console.log('DELETE DEBUG: current builds:', db.data.builds.map(b => b.id));
  const idx = db.data.builds.findIndex(b => b.id === req.params.id);
  if (idx === -1) {
    console.log('DELETE DEBUG: build not found');
    return res.status(404).json({ error: 'Build not found' });
  }
  const build = db.data.builds[idx];
  // Delete image file if exists
  if (build.image && fs.existsSync(path.join(__dirname, build.image))) {
    fs.unlinkSync(path.join(__dirname, build.image));
  }
  db.data.builds.splice(idx, 1);
  await db.write();
  console.log('DELETE DEBUG: build deleted:', req.params.id);
  res.json({ success: true });
});

// Simple in-memory session for MVP
let sessions = {};
function isAdmin(req) {
  return req.headers['x-admin-session'] === 'imow';
}
function isMod(req) {
  return sessions[req.headers['x-mod-session']];
}

// Mod login
app.post('/api/mods/login', (req, res) => {
  const { username, password } = req.body;
  console.log('MOD LOGIN DEBUG:', { username, password });
  if (username === 'imow' && password === ADMIN_PASSWORD) {
    return res.json({ role: 'admin', session: 'imow' });
  }
  const mods = readMods();
  console.log('MOD LOGIN DEBUG: mods list', mods);
  const mod = mods.find(m => m.username === username && m.password === password);
  if (mod) {
    const session = nanoid(16);
    sessions[session] = username;
    return res.json({ role: 'mod', session });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// List mods (admin only)
app.get('/api/mods', (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  res.json(readMods());
});

// Add mod (admin only)
app.post('/api/mods', (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  let mods = readMods();
  if (mods.find(m => m.username === username)) return res.status(400).json({ error: 'Username exists' });
  mods.push({ username, password });
  writeMods(mods);
  res.json({ success: true });
});

// Delete mod (admin only)
app.delete('/api/mods/:username', (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  let mods = readMods();
  mods = mods.filter(m => m.username !== req.params.username);
  writeMods(mods);
  res.json({ success: true });
});

const modsFile = path.join(__dirname, 'mods.json');
function readMods() {
  return JSON.parse(fs.readFileSync(modsFile, 'utf-8')).mods;
}
function writeMods(mods) {
  fs.writeFileSync(modsFile, JSON.stringify({ mods }, null, 2));
}

// Start server
app.listen(PORT, () => {
  console.log(`Gun Builds backend running on http://localhost:${PORT}`);
}); 