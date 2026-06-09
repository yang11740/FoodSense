const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 4000;

const dbPath = path.resolve(__dirname, 'foodsense.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open database', err);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      goal TEXT,
      age TEXT,
      gender TEXT,
      dietStyle TEXT,
      mood TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: '请输入姓名、邮箱和密码进行注册。' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
    function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(409).json({ error: '该邮箱已被注册，请直接登录。' });
        }
        console.error(err);
        return res.status(500).json({ error: '注册失败，请稍后重试。' });
      }

      res.status(201).json({ id: this.lastID, name, email });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: '请输入邮箱和密码进行登录。' });
  }

  db.get('SELECT id, name, email, password FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: '登录失败，请稍后重试。' });
    }

    if (!row || !bcrypt.compareSync(password, row.password)) {
      return res.status(401).json({ error: '邮箱或密码不正确，请检查后重试。' });
    }

    res.json({ id: row.id, name: row.name, email: row.email });
  });
});

app.post('/api/profile', (req, res) => {
  const { email, goal, age, gender, dietStyle, mood } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: '缺少用户邮箱，无法保存个人资料。' });
  }

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: '保存失败，请稍后重试。' });
    }

    if (!row) {
      return res.status(404).json({ error: '用户不存在，请先登录。' });
    }

    db.run(
      `INSERT INTO profiles (user_id, goal, age, gender, dietStyle, mood, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id) DO UPDATE SET
         goal = excluded.goal,
         age = excluded.age,
         gender = excluded.gender,
         dietStyle = excluded.dietStyle,
         mood = excluded.mood,
         updated_at = CURRENT_TIMESTAMP`,
      [row.id, goal, age, gender, dietStyle, mood],
      function (profileErr) {
        if (profileErr) {
          console.error(profileErr);
          return res.status(500).json({ error: '保存个人资料失败，请稍后重试。' });
        }

        res.json({ userId: row.id, goal, age, gender, dietStyle, mood });
      }
    );
  });
});

app.get('/api/profile', (req, res) => {
  const email = String(req.query.email || '');
  if (!email) {
    return res.status(400).json({ error: '缺少邮箱参数。' });
  }

  db.get(
    `SELECT p.goal, p.age, p.gender, p.dietStyle, p.mood
     FROM profiles p
     JOIN users u ON u.id = p.user_id
     WHERE u.email = ?`,
    [email],
    (err, profile) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: '获取个人资料失败，请稍后重试。' });
      }

      res.json(profile || {});
    }
  );
});

app.listen(PORT, () => {
  console.log(`FoodSense backend listening at http://localhost:${PORT}`);
});
