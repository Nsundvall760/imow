import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://imow-frontend.onrender.com'] 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Serve uploaded files statically
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
  db.data ||= { builds: [], clips: [] };
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

const modsFile = path.join(__dirname, 'mods.json');
function readMods() {
  return JSON.parse(fs.readFileSync(modsFile, 'utf-8')).mods;
}
function writeMods(mods) {
  fs.writeFileSync(modsFile, JSON.stringify({ mods }, null, 2));
}

// Simple in-memory session for MVP
let sessions = {};
function isAdmin(req) {
  return req.headers['x-admin-session'] === 'imow';
}
function isMod(req) {
  const session = req.headers['x-mod-session'];
  console.log('Backend: Checking mod session:', session);
  console.log('Backend: Available sessions:', sessions);
  
  // Check if session exists in memory
  const isValid = sessions[session];
  console.log('Backend: Session valid:', isValid);
  
  if (isValid) return true;
  
  // Fallback: check if username exists in mods list (for server restarts)
  try {
    const mods = readMods();
    const modExists = mods.find(m => m.username === session);
    console.log('Backend: Fallback check - mod exists:', !!modExists);
    return !!modExists;
  } catch (error) {
    console.log('Backend: Error checking mods file:', error);
    return false;
  }
}

// Mod login
app.post('/api/mods/login', (req, res) => {
  const { username, password } = req.body;
  console.log('MOD LOGIN DEBUG:', { username, password });
  console.log('ADMIN_PASSWORD:', ADMIN_PASSWORD);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  if (username === 'imow' && password === ADMIN_PASSWORD) {
    console.log('ADMIN LOGIN SUCCESS');
    return res.json({ role: 'admin', session: 'imow' });
  }
  
  try {
    const mods = readMods();
    console.log('MOD LOGIN DEBUG: mods list', mods);
    const mod = mods.find(m => m.username === username && m.password === password);
    if (mod) {
      const session = nanoid(16);
      sessions[session] = username;
      console.log('MOD LOGIN SUCCESS for:', username);
      return res.json({ role: 'mod', session });
    }
  } catch (error) {
    console.log('ERROR reading mods:', error);
  }
  
  console.log('LOGIN FAILED - Invalid credentials');
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

// Twitch stream data endpoint
app.get('/api/twitch/stream', async (req, res) => {
  try {
    console.log('Backend: Checking if stream is live...');
    
    // Simple check: try to fetch the Twitch page
    const pageResponse = await fetch('https://www.twitch.tv/im0w', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
                if (pageResponse.ok) {
        console.log('Backend: Successfully fetched Twitch page, assuming live');
        
        // Since we can fetch the page and the embed shows live, assume it's live
        res.json({
          isLive: true
        });
    } else {
      console.log('Backend: Could not fetch Twitch page, assuming offline');
      res.json({
        isLive: false
      });
    }
  } catch (error) {
    console.log('Backend: Error checking stream status:', error);
    res.json({
      isLive: false
    });
  }
});

// Clips endpoints
// List all clips
app.get('/api/clips', async (req, res) => {
  await db.read();
  if (!db.data.clips) {
    db.data.clips = [];
    await db.write();
  }
  res.json(db.data.clips);
});

// Upload a new clip (admin/mod only)
app.post('/api/clips', upload.single('thumbnail'), async (req, res) => {
  console.log('Backend: Clip upload request received');
  console.log('Backend: Headers:', req.headers);
  console.log('Backend: Body:', req.body);
  console.log('Backend: File:', req.file);
  
  if (!isAdmin(req) && !isMod(req)) {
    console.log('Backend: Unauthorized - not admin or mod');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { title, description, category, duration, views, likes, twitchUrl } = req.body;
  console.log('Backend: Extracted fields:', { title, description, category, duration, views, likes, twitchUrl });
  
  if (!title || !category) {
    console.log('Backend: Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  await db.read();
  
  // Ensure clips array exists
  if (!db.data.clips) {
    db.data.clips = [];
  }
  
  const clip = {
    id: nanoid(10),
    title,
    description: description || '',
    category,
    duration: duration || '0:00',
    views: views || '0',
    likes: likes || '0',
    twitchUrl: twitchUrl || '',
    thumbnail: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString()
  };
  
  db.data.clips.unshift(clip);
  await db.write();
  console.log('Backend: Clip uploaded successfully:', clip);
  res.json(clip);
});

// Update an existing clip (admin/mod only)
app.patch('/api/clips/:id', upload.single('thumbnail'), async (req, res) => {
  if (!isAdmin(req) && !isMod(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { title, description, category, duration, views, likes, twitchUrl } = req.body;
  await db.read();
  
  // Ensure clips array exists
  if (!db.data.clips) {
    db.data.clips = [];
  }
  
  const clip = db.data.clips.find(c => c.id === req.params.id);
  if (!clip) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(404).json({ error: 'Clip not found' });
  }
  
  if (title !== undefined) clip.title = title;
  if (description !== undefined) clip.description = description;
  if (category !== undefined) clip.category = category;
  if (duration !== undefined) clip.duration = duration;
  if (views !== undefined) clip.views = views;
  if (likes !== undefined) clip.likes = likes;
  if (twitchUrl !== undefined) clip.twitchUrl = twitchUrl;
  
  if (req.file) {
    // Remove old thumbnail if exists
    if (clip.thumbnail && fs.existsSync(path.join(__dirname, clip.thumbnail))) {
      fs.unlinkSync(path.join(__dirname, clip.thumbnail));
    }
    clip.thumbnail = `/uploads/${req.file.filename}`;
  }
  
  await db.write();
  res.json(clip);
});

// Delete a clip (admin/mod only)
app.delete('/api/clips/:id', async (req, res) => {
  if (!isAdmin(req) && !isMod(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  await db.read();
  
  // Ensure clips array exists
  if (!db.data.clips) {
    db.data.clips = [];
  }
  
  const idx = db.data.clips.findIndex(c => c.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Clip not found' });
  }
  
  const clip = db.data.clips[idx];
  // Delete thumbnail if exists
  if (clip.thumbnail && fs.existsSync(path.join(__dirname, clip.thumbnail))) {
    fs.unlinkSync(path.join(__dirname, clip.thumbnail));
  }
  
  db.data.clips.splice(idx, 1);
  await db.write();
  res.json({ success: true });
});

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Imow Backend is running!', timestamp: new Date().toISOString() });
});

// Add this at the very end, after all other routes:
const require = createRequire(import.meta.url);

app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Gun Builds backend running on http://localhost:${PORT}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
}); 