const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'kingofthehalf.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      group_class TEXT NOT NULL DEFAULT 'Stock Motor',
      photo_url TEXT NOT NULL,
      tokens INTEGER DEFAULT 1,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      is_eliminated INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Matches Table
  db.run(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      winner_id TEXT NOT NULL,
      loser_id TEXT NOT NULL,
      tokens_transferred INTEGER NOT NULL,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(winner_id) REFERENCES users(id),
      FOREIGN KEY(loser_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;
