const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 4001;

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

  db.run(`
    CREATE TABLE IF NOT EXISTS recipe_records (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      meal TEXT NOT NULL,
      name TEXT NOT NULL,
      calories INTEGER NOT NULL DEFAULT 0,
      carbs INTEGER NOT NULL DEFAULT 0,
      protein INTEGER NOT NULL DEFAULT 0,
      fat INTEGER NOT NULL DEFAULT 0,
      ingredients TEXT NOT NULL DEFAULT '[]',
      cookingTechnique TEXT NOT NULL,
      cookingMethod TEXT NOT NULL,
      recommendation TEXT NOT NULL,
      summary TEXT NOT NULL,
      reasons TEXT NOT NULL DEFAULT '[]',
      tags TEXT NOT NULL DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run('CREATE INDEX IF NOT EXISTS idx_recipe_records_user_date ON recipe_records(user_id, date)');

  db.run(`
    CREATE TABLE IF NOT EXISTS user_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      goal TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, goal),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      preference TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, preference),
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
  const { email, name, goal, age, gender, dietStyle, mood } = req.body || {};
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

app.post('/api/user', (req, res) => {
  const { email, name } = req.body || {};
  const nextName = String(name || '').trim();
  if (!email || !nextName) {
    return res.status(400).json({ error: 'Missing email or name.' });
  }

  db.run('UPDATE users SET name = ? WHERE email = ?', [nextName, email], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update user.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ name: nextName, email });
  });
});

const parseJsonArray = (value) => {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (_err) {
    return [];
  }
};

const toRecipeResponse = (row) => ({
  id: row.id,
  date: row.date,
  meal: row.meal,
  name: row.name,
  calories: row.calories,
  carbs: row.carbs,
  protein: row.protein,
  fat: row.fat,
  ingredients: parseJsonArray(row.ingredients),
  cookingTechnique: row.cookingTechnique,
  cookingMethod: row.cookingMethod,
  recommendation: row.recommendation,
  summary: row.summary,
  reasons: parseJsonArray(row.reasons),
  tags: parseJsonArray(row.tags),
});

app.get('/api/recipes', (req, res) => {
  const email = String(req.query.email || '');
  if (!email) {
    return res.status(400).json({ error: 'Missing email query parameter.' });
  }

  db.all(
    `SELECT r.*
     FROM recipe_records r
     JOIN users u ON u.id = r.user_id
     WHERE u.email = ?
     ORDER BY r.date DESC, r.created_at DESC`,
    [email],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to load recipe records.' });
      }

      res.json(rows.map(toRecipeResponse));
    }
  );
});

app.post('/api/recipes', (req, res) => {
  const { email, record } = req.body || {};
  if (!email || !record) {
    return res.status(400).json({ error: 'Missing email or recipe record.' });
  }

  const requiredFields = ['id', 'date', 'meal', 'name', 'cookingTechnique', 'cookingMethod', 'recommendation', 'summary'];
  const missingField = requiredFields.find((field) => !record[field]);
  if (missingField) {
    return res.status(400).json({ error: `Missing recipe field: ${missingField}.` });
  }

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, userRow) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save recipe record.' });
    }

    if (!userRow) {
      return res.status(404).json({ error: 'User not found.' });
    }

    db.run(
      `INSERT INTO recipe_records (
         id, user_id, date, meal, name, calories, carbs, protein, fat,
         ingredients, cookingTechnique, cookingMethod, recommendation, summary, reasons, tags, updated_at
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET
         date = excluded.date,
         meal = excluded.meal,
         name = excluded.name,
         calories = excluded.calories,
         carbs = excluded.carbs,
         protein = excluded.protein,
         fat = excluded.fat,
         ingredients = excluded.ingredients,
         cookingTechnique = excluded.cookingTechnique,
         cookingMethod = excluded.cookingMethod,
         recommendation = excluded.recommendation,
         summary = excluded.summary,
         reasons = excluded.reasons,
         tags = excluded.tags,
         updated_at = CURRENT_TIMESTAMP`,
      [
        record.id,
        userRow.id,
        record.date,
        record.meal,
        record.name,
        Number(record.calories) || 0,
        Number(record.carbs) || 0,
        Number(record.protein) || 0,
        Number(record.fat) || 0,
        JSON.stringify(Array.isArray(record.ingredients) ? record.ingredients : []),
        record.cookingTechnique,
        record.cookingMethod,
        record.recommendation,
        record.summary,
        JSON.stringify(Array.isArray(record.reasons) ? record.reasons : []),
        JSON.stringify(Array.isArray(record.tags) ? record.tags : []),
      ],
      function (recipeErr) {
        if (recipeErr) {
          console.error(recipeErr);
          return res.status(500).json({ error: 'Failed to save recipe record.' });
        }

        res.status(201).json(record);
      }
    );
  });
});

const getUserByEmail = (email, res, callback) => {
  if (!email) {
    res.status(400).json({ error: 'Missing email.' });
    return;
  }

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, userRow) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to load user.' });
      return;
    }

    if (!userRow) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    callback(userRow);
  });
};

app.get('/api/goals', (req, res) => {
  const email = String(req.query.email || '');
  getUserByEmail(email, res, (userRow) => {
    db.all(
      'SELECT goal FROM user_goals WHERE user_id = ? ORDER BY created_at ASC, id ASC',
      [userRow.id],
      (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to load goals.' });
        }

        res.json(rows.map((row) => row.goal));
      }
    );
  });
});

app.post('/api/goals', (req, res) => {
  const { email, goal } = req.body || {};
  const normalizedGoal = String(goal || '').trim();
  if (!normalizedGoal) {
    return res.status(400).json({ error: 'Missing goal.' });
  }

  getUserByEmail(email, res, (userRow) => {
    db.run(
      'INSERT OR IGNORE INTO user_goals (user_id, goal) VALUES (?, ?)',
      [userRow.id, normalizedGoal],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to save goal.' });
        }

        res.status(201).json({ goal: normalizedGoal });
      }
    );
  });
});

app.delete('/api/goals', (req, res) => {
  const email = String(req.query.email || '');
  const goal = String(req.query.goal || '').trim();
  if (!goal) {
    return res.status(400).json({ error: 'Missing goal.' });
  }

  getUserByEmail(email, res, (userRow) => {
    db.run('DELETE FROM user_goals WHERE user_id = ? AND goal = ?', [userRow.id, goal], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete goal.' });
      }

      res.json({ deleted: true });
    });
  });
});

app.get('/api/preferences', (req, res) => {
  const email = String(req.query.email || '');
  getUserByEmail(email, res, (userRow) => {
    db.all(
      'SELECT preference FROM user_preferences WHERE user_id = ? ORDER BY created_at ASC, id ASC',
      [userRow.id],
      (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to load preferences.' });
        }

        res.json(rows.map((row) => row.preference));
      }
    );
  });
});

app.post('/api/preferences', (req, res) => {
  const { email, preference } = req.body || {};
  const normalizedPreference = String(preference || '').trim();
  if (!normalizedPreference) {
    return res.status(400).json({ error: 'Missing preference.' });
  }

  getUserByEmail(email, res, (userRow) => {
    db.run(
      'INSERT OR IGNORE INTO user_preferences (user_id, preference) VALUES (?, ?)',
      [userRow.id, normalizedPreference],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to save preference.' });
        }

        res.status(201).json({ preference: normalizedPreference });
      }
    );
  });
});

app.delete('/api/preferences', (req, res) => {
  const email = String(req.query.email || '');
  const preference = String(req.query.preference || '').trim();
  if (!preference) {
    return res.status(400).json({ error: 'Missing preference.' });
  }

  getUserByEmail(email, res, (userRow) => {
    db.run(
      'DELETE FROM user_preferences WHERE user_id = ? AND preference = ?',
      [userRow.id, preference],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to delete preference.' });
        }

        res.json({ deleted: true });
      }
    );
  });
});

const server = app.listen(PORT, () => {
  console.log(`FoodSense backend listening at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to a free port.`);
  } else {
    console.error('Failed to start server', err);
  }
  process.exit(1);
});
