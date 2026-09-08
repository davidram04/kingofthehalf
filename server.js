const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${uuidv4().substring(0, 8)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Helper to fetch riders with filter
function getRiders(queryFilters, cb) {
  const { state, group_class, sortBy } = queryFilters;

  let query = `
    SELECT *, 
    CASE 
      WHEN (wins + losses) = 0 THEN 0 
      ELSE ROUND((CAST(wins AS FLOAT) / (wins + losses)) * 100, 1) 
    END AS win_percentage
    FROM users
  `;

  const where = [];
  const params = [];

  if (state && state.trim() !== '') {
    where.push(`UPPER(state) = ?`);
    params.push(state.trim().toUpperCase());
  }

  if (group_class && group_class.trim() !== '') {
    where.push(`group_class = ?`);
    params.push(group_class.trim());
  }

  if (where.length > 0) {
    query += ` WHERE ` + where.join(' AND ');
  }

  if (sortBy === 'win_rate') {
    query += ` ORDER BY win_percentage DESC, wins DESC, tokens DESC`;
  } else if (sortBy === 'tokens') {
    query += ` ORDER BY tokens DESC, wins DESC, win_percentage DESC`;
  } else {
    query += ` ORDER BY wins DESC, win_percentage DESC, tokens DESC`;
  }

  db.all(query, params, cb);
}

// ---------------- ROUTES ----------------

// Home Page (Hero + Rider Standings + Rankings + Classes + Rules + QA)
app.get('/', (req, res) => {
  getRiders(req.query, (err, users) => {
    if (err) console.error(err);
    res.render('index', {
      users: users || [],
      currentState: req.query.state || '',
      currentGroup: req.query.group_class || '',
      currentSort: req.query.sortBy || 'wins',
      registeredId: req.query.registeredId || null
    });
  });
});

// Standalone Pages
app.get('/riders', (req, res) => {
  getRiders(req.query, (err, users) => {
    res.render('index', {
      users: users || [],
      currentState: req.query.state || '',
      currentGroup: req.query.group_class || '',
      currentSort: req.query.sortBy || 'wins',
      registeredId: null,
      scrollTo: 'riders'
    });
  });
});

app.get('/rankings', (req, res) => {
  getRiders(req.query, (err, users) => {
    res.render('index', {
      users: users || [],
      currentState: req.query.state || '',
      currentGroup: req.query.group_class || '',
      currentSort: req.query.sortBy || 'wins',
      registeredId: null,
      scrollTo: 'rankings'
    });
  });
});

app.get('/classes', (req, res) => res.redirect('/#classes'));
app.get('/rules', (req, res) => res.redirect('/#rules'));
app.get('/qa', (req, res) => res.redirect('/#qa'));

// Registration Page
app.get('/register', (req, res) => res.render('register', { error: null }));

app.post('/register', upload.single('photo'), (req, res) => {
  const { name, state, group_class } = req.body;

  if (!name || !state || !group_class) {
    return res.render('register', { error: 'Please fill in all required fields.' });
  }

  const photoUrl = req.file ? `/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&auto=format&fit=crop&q=80';
  const uniqueId = 'KOTH-' + uuidv4().substring(0, 6).toUpperCase();

  const query = `INSERT INTO users (id, name, state, group_class, photo_url, tokens, wins, losses, is_eliminated) VALUES (?, ?, ?, ?, ?, 1, 0, 0, 0)`;

  db.run(query, [uniqueId, name.trim(), state.trim().toUpperCase(), group_class, photoUrl], function (err) {
    if (err) {
      console.error(err);
      return res.render('register', { error: 'Error registering rider.' });
    }
    res.redirect(`/?registeredId=${uniqueId}#rankings`);
  });
});

// Admin Panel
app.get('/admin', (req, res) => {
  db.all(`SELECT id, name, state, group_class, tokens FROM users WHERE is_eliminated = 0 ORDER BY name ASC`, [], (err, activeUsers) => {
    db.all(`SELECT m.id, m.tokens_transferred, m.played_at, w.name as winner_name, l.name as loser_name 
            FROM matches m 
            JOIN users w ON m.winner_id = w.id 
            JOIN users l ON m.loser_id = l.id 
            ORDER BY m.played_at DESC LIMIT 15`, [], (err, recentMatches) => {
      res.render('admin', { 
        users: activeUsers || [], 
        matches: recentMatches || [], 
        error: req.query.error || null, 
        success: req.query.success || null 
      });
    });
  });
});

app.post('/admin/record-match', (req, res) => {
  const { winnerId, loserId } = req.body;

  if (!winnerId || !loserId || winnerId === loserId) {
    return res.redirect('/admin?error=Please select two different riders.');
  }

  db.get(`SELECT tokens, is_eliminated FROM users WHERE id = ?`, [loserId], (err, loser) => {
    if (err || !loser || loser.is_eliminated === 1) {
      return res.redirect('/admin?error=Invalid or eliminated loser.');
    }

    const tokensToTransfer = loser.tokens;

    db.serialize(() => {
      db.run(`UPDATE users SET tokens = tokens + ?, wins = wins + 1 WHERE id = ?`, [tokensToTransfer, winnerId]);
      db.run(`UPDATE users SET tokens = 0, losses = losses + 1, is_eliminated = 1 WHERE id = ?`, [loserId]);
      db.run(`INSERT INTO matches (winner_id, loser_id, tokens_transferred) VALUES (?, ?, ?)`, [winnerId, loserId, tokensToTransfer]);
      res.redirect('/admin?success=Match recorded! Loser tokens transferred & profile set to B&W.');
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
