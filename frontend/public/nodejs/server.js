require('dotenv').config();
if (!process.env.LLM_API_KEY) {
    process.env.LLM_API_KEY = '7e9ba02834c44d19971b19a1edae42d2.gKqTUxTEgmIBxZWK';
    console.log('⚠️ Using hardcoded LLM_API_KEY (for testing only)');
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const Datastore = require('@seald-io/nedb');
const bcrypt = require('bcryptjs');
const { buildHealthSummary, buildHealthProfile, loadUserHealthContext } = require('./healthAnalytics');
const { buildNutritionTargets } = require('./nutritionTargets');
const { buildChatContext, buildWelcomeMessage, generateAssistantReply } = require('./chatAssistant');
const { analyzeFoodImage } = require('./foodVision');

const app = express();
const PORT = process.env.PORT || 4001;

// Initialize NeDB Datastores
const db = {};
const dataDir = path.resolve(__dirname, 'data');
// Ensure data directory exists could be done, but NeDB handles file creation.
db.users = new Datastore({ filename: path.join(dataDir, 'users.db'), autoload: true });
db.profiles = new Datastore({ filename: path.join(dataDir, 'profiles.db'), autoload: true });
db.recipe_records = new Datastore({ filename: path.join(dataDir, 'recipe_records.db'), autoload: true });
db.user_goals = new Datastore({ filename: path.join(dataDir, 'user_goals.db'), autoload: true });
db.user_preferences = new Datastore({ filename: path.join(dataDir, 'user_preferences.db'), autoload: true });
db.chat_messages = new Datastore({ filename: path.join(dataDir, 'chat_messages.db'), autoload: true });

// Ensure Indices
db.users.ensureIndex({ fieldName: 'email', unique: true });
db.profiles.ensureIndex({ fieldName: 'user_id', unique: true });
db.recipe_records.ensureIndex({ fieldName: 'id', unique: true });
db.user_goals.ensureIndex({ fieldName: 'user_id' });
db.user_preferences.ensureIndex({ fieldName: 'user_id' });
db.chat_messages.ensureIndex({ fieldName: 'user_id' });

const defaultReminderSettings = {
  medication: true,
  diet: true,
  review: true,
};

const parseReminderSettings = (value) => {
  if (typeof value === 'object' && value !== null) return value;
  try {
    const parsed = JSON.parse(value || '{}');
    return {
      medication: parsed.medication !== false,
      diet: parsed.diet !== false,
      review: parsed.review !== false,
    };
  } catch (_err) {
    return { ...defaultReminderSettings };
  }
};

//app.use(cors({ origin: 'http://localhost:5173' }));
app.use(cors({ origin: true }));
app.use(express.json({ limit: '12mb' }));

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: '请输入姓名、邮箱和密码进行注册。' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    name,
    email,
    password: hashedPassword,
    created_at: new Date().toISOString()
  };

  db.users.insert(newUser, (err, doc) => {
    if (err) {
      if (err.errorType === 'uniqueViolated') {
        return res.status(409).json({ error: '该邮箱已被注册，请直接登录。' });
      }
      console.error(err);
      return res.status(500).json({ error: '注册失败，请稍后重试。' });
    }
    res.status(201).json({ id: doc._id, name: doc.name, email: doc.email });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: '请输入邮箱和密码进行登录。' });
  }

  db.users.findOne({ email }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: '登录失败，请稍后重试。' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: '邮箱或密码不正确，请检查后重试。' });
    }

    res.json({ id: user._id, name: user.name, email: user.email });
  });
});

app.post('/api/profile', (req, res) => {
  const { email, name, goal, age, gender, dietStyle, mood, height, weight } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: '缺少用户邮箱，无法保存个人资料。' });
  }

  db.users.findOne({ email }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: '保存失败，请稍后重试。' });
    }

    if (!user) {
      return res.status(404).json({ error: '用户不存在，请先登录。' });
    }

    const userId = user._id;
    const profileUpdate = {
      user_id: userId,
      goal,
      age,
      gender,
      dietStyle,
      mood,
      height,
      weight,
      updated_at: new Date().toISOString()
    };

    db.profiles.update(
      { user_id: userId },
      { $set: profileUpdate },
      { upsert: true },
      (profileErr) => {
        if (profileErr) {
          console.error(profileErr);
          return res.status(500).json({ error: '保存个人资料失败，请稍后重试。' });
        }
        res.json({ userId, goal, age, gender, dietStyle, mood, height, weight });
      }
    );
  });
});

app.get('/api/profile', (req, res) => {
  const email = String(req.query.email || '');
  if (!email) {
    return res.status(400).json({ error: '缺少邮箱参数。' });
  }

  db.users.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.json({});
    }

    db.profiles.findOne({ user_id: user._id }, (profileErr, profile) => {
      if (profileErr) {
        console.error(profileErr);
        return res.status(500).json({ error: '获取个人资料失败，请稍后重试。' });
      }
      res.json(profile || {});
    });
  });
});

app.post('/api/user', (req, res) => {
  const { email, name } = req.body || {};
  const nextName = String(name || '').trim();
  if (!email || !nextName) {
    return res.status(400).json({ error: 'Missing email or name.' });
  }

  db.users.update({ email }, { $set: { name: nextName } }, {}, (err, numReplaced) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update user.' });
    }

    if (numReplaced === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ name: nextName, email });
  });
});

const toRecipeResponse = (row) => ({
  id: row.id,
  date: row.date,
  meal: row.meal,
  name: row.name,
  calories: row.calories,
  carbs: row.carbs,
  protein: row.protein,
  fat: row.fat,
  ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
  cookingTechnique: row.cookingTechnique,
  cookingMethod: row.cookingMethod,
  recommendation: row.recommendation,
  summary: row.summary,
  reasons: Array.isArray(row.reasons) ? row.reasons : [],
  tags: Array.isArray(row.tags) ? row.tags : [],
});

app.get('/api/recipes', (req, res) => {
  const email = String(req.query.email || '');
  if (!email) {
    return res.status(400).json({ error: 'Missing email query parameter.' });
  }

  db.users.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.json([]);
    }

    db.recipe_records.find({ user_id: user._id })
      .sort({ date: -1, created_at: -1 })
      .exec((recipeErr, rows) => {
        if (recipeErr) {
          console.error(recipeErr);
          return res.status(500).json({ error: 'Failed to load recipe records.' });
        }
        res.json(rows.map(toRecipeResponse));
      });
  });
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

  db.users.findOne({ email }, (err, userRow) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save recipe record.' });
    }

    if (!userRow) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const recipeDoc = {
      id: record.id,
      user_id: userRow._id,
      date: record.date,
      meal: record.meal,
      name: record.name,
      calories: Number(record.calories) || 0,
      carbs: Number(record.carbs) || 0,
      protein: Number(record.protein) || 0,
      fat: Number(record.fat) || 0,
      ingredients: Array.isArray(record.ingredients) ? record.ingredients : [],
      cookingTechnique: record.cookingTechnique,
      cookingMethod: record.cookingMethod,
      recommendation: record.recommendation,
      summary: record.summary,
      reasons: Array.isArray(record.reasons) ? record.reasons : [],
      tags: Array.isArray(record.tags) ? record.tags : [],
      updated_at: new Date().toISOString(),
      created_at: record.created_at || new Date().toISOString()
    };

    db.recipe_records.update(
      { id: record.id },
      { $set: recipeDoc },
      { upsert: true },
      (recipeErr) => {
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

  db.users.findOne({ email }, (err, userRow) => {
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
    db.user_goals.find({ user_id: userRow._id })
      .sort({ created_at: 1 })
      .exec((err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to load goals.' });
        }
        res.json(rows.map((row) => row.goal));
      });
  });
});

app.post('/api/goals', (req, res) => {
  const { email, goal } = req.body || {};
  const normalizedGoal = String(goal || '').trim();
  if (!normalizedGoal) {
    return res.status(400).json({ error: 'Missing goal.' });
  }

  getUserByEmail(email, res, (userRow) => {
    db.user_goals.findOne({ user_id: userRow._id, goal: normalizedGoal }, (err, existing) => {
      if (existing) return res.status(201).json({ goal: normalizedGoal });

      db.user_goals.insert({
        user_id: userRow._id,
        goal: normalizedGoal,
        created_at: new Date().toISOString()
      }, (insertErr) => {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ error: 'Failed to save goal.' });
        }
        res.status(201).json({ goal: normalizedGoal });
      });
    });
  });
});

app.delete('/api/goals', (req, res) => {
  const email = String(req.query.email || '');
  const goal = String(req.query.goal || '').trim();
  if (!goal) {
    return res.status(400).json({ error: 'Missing goal.' });
  }

  getUserByEmail(email, res, (userRow) => {
    db.user_goals.remove({ user_id: userRow._id, goal: goal }, {}, (err) => {
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
    db.user_preferences.find({ user_id: userRow._id })
      .sort({ created_at: 1 })
      .exec((err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to load preferences.' });
        }
        res.json(rows.map((row) => row.preference));
      });
  });
});

app.post('/api/preferences', (req, res) => {
  const { email, preference } = req.body || {};
  const normalizedPreference = String(preference || '').trim();
  if (!normalizedPreference) {
    return res.status(400).json({ error: 'Missing preference.' });
  }

  getUserByEmail(email, res, (userRow) => {
    db.user_preferences.findOne({ user_id: userRow._id, preference: normalizedPreference }, (err, existing) => {
      if (existing) return res.status(201).json({ preference: normalizedPreference });

      db.user_preferences.insert({
        user_id: userRow._id,
        preference: normalizedPreference,
        created_at: new Date().toISOString()
      }, (insertErr) => {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ error: 'Failed to save preference.' });
        }
        res.status(201).json({ preference: normalizedPreference });
      });
    });
  });
});

app.delete('/api/preferences', (req, res) => {
  const email = String(req.query.email || '');
  const preference = String(req.query.preference || '').trim();
  if (!preference) {
    return res.status(400).json({ error: 'Missing preference.' });
  }

  getUserByEmail(email, res, (userRow) => {
    db.user_preferences.remove({ user_id: userRow._id, preference: preference }, {}, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete preference.' });
      }
      res.json({ deleted: true });
    });
  });
});

const handleHealthRequest = (req, res, builder) => {
  const email = String(req.query.email || '');
  if (!email) {
    return res.status(400).json({ error: 'Missing email.' });
  }

  loadUserHealthContext(db, email, (err, context) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load health insights.' });
    }

    if (!context) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(
      builder({
        records: context.records,
        profile: context.profile,
        goals: context.goals,
        preferences: context.preferences,
      })
    );
  });
};

app.get('/api/health/summary', (req, res) => {
  handleHealthRequest(req, res, buildHealthSummary);
});

app.get('/api/health/profile', (req, res) => {
  handleHealthRequest(req, res, buildHealthProfile);
});

app.get('/api/reminders/settings', (req, res) => {
  const email = String(req.query.email || '');
  if (!email) {
    return res.status(400).json({ error: 'Missing email.' });
  }

  db.users.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.json(parseReminderSettings(null));
    }

    db.profiles.findOne({ user_id: user._id }, (profileErr, profile) => {
      if (profileErr) {
        console.error(profileErr);
        return res.status(500).json({ error: 'Failed to load reminder settings.' });
      }
      res.json(parseReminderSettings(profile?.reminder_settings));
    });
  });
});

app.post('/api/reminders/settings', (req, res) => {
  const { email, settings } = req.body || {};
  if (!email || !settings) {
    return res.status(400).json({ error: 'Missing email or settings.' });
  }

  const nextSettings = parseReminderSettings(settings);

  db.users.findOne({ email }, (err, userRow) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save reminder settings.' });
    }

    if (!userRow) {
      return res.status(404).json({ error: 'User not found.' });
    }

    db.profiles.update(
      { user_id: userRow._id },
      { $set: { reminder_settings: nextSettings, updated_at: new Date().toISOString() } },
      { upsert: true },
      (saveErr) => {
        if (saveErr) {
          console.error(saveErr);
          return res.status(500).json({ error: 'Failed to save reminder settings.' });
        }
        res.json(nextSettings);
      }
    );
  });
});

app.post('/api/analyze', async (req, res) => {
  const { email, imageDataUrl, mode } = req.body || {};
  if (!email || !imageDataUrl) {
    return res.status(400).json({ error: '缺少邮箱或图片数据。' });
  }

  loadUserHealthContext(db, email, async (err, context) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: '分析失败，请稍后重试。' });
    }

    if (!context) {
      return res.status(404).json({ error: '用户不存在，请先登录。' });
    }

    try {
      const result = await analyzeFoodImage({
        imageDataUrl: String(imageDataUrl),
        mode: mode || 'food',
        userContext: context,
      });
      res.json(result);
    } catch (analyzeErr) {
      console.error(analyzeErr);
      res.status(500).json({ error: analyzeErr.message || '食物识别失败，请稍后重试。' });
    }
  });
});

app.get('/api/nutrition/targets', (req, res) => {
  const email = String(req.query.email || '');
  if (!email) {
    return res.status(400).json({ error: 'Missing email.' });
  }

  loadUserHealthContext(db, email, (err, context) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load nutrition targets.' });
    }

    if (!context) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(buildNutritionTargets({ profile: context.profile }));
  });
});

const toChatMessage = (row) => ({
  id: row.id,
  from: row.role === 'user' ? 'user' : 'assistant',
  text: row.text,
  createdAt: row.created_at,
});

const insertChatMessage = (userId, role, text, callback) => {
  const id = `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const message = {
    id,
    user_id: userId,
    role,
    text,
    created_at: new Date().toISOString()
  };
  db.chat_messages.insert(message, (err, doc) => {
    callback(err, { id, from: role === 'user' ? 'user' : 'assistant', text, createdAt: doc.created_at });
  });
};

app.get('/api/chat/messages', (req, res) => {
  const email = String(req.query.email || '');
  if (!email) {
    return res.status(400).json({ error: 'Missing email.' });
  }

  loadUserHealthContext(db, email, (err, context) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load chat messages.' });
    }

    if (!context) {
      return res.status(404).json({ error: 'User not found.' });
    }

    db.chat_messages.find({ user_id: context.userId })
      .sort({ created_at: 1 })
      .exec((messageErr, rows) => {
        if (messageErr) {
          console.error(messageErr);
          return res.status(500).json({ error: 'Failed to load chat messages.' });
        }

        const messages = (rows || []).map(toChatMessage);
        if (messages.length > 0) {
          return res.json(messages);
        }

        const chatContext = buildChatContext({
          userName: context.userName,
          profile: context.profile,
          goals: context.goals,
          preferences: context.preferences,
          records: context.records,
        });
        const welcomeText = buildWelcomeMessage(chatContext);

        insertChatMessage(context.userId, 'assistant', welcomeText, (insertErr, welcomeMessage) => {
          if (insertErr) {
            console.error(insertErr);
            return res.status(500).json({ error: 'Failed to initialize chat.' });
          }

          res.json([welcomeMessage]);
        });
      });
  });
});

app.post('/api/chat', async (req, res) => {
  const { email, message } = req.body || {};
  const normalizedMessage = String(message || '').trim();
  if (!email || !normalizedMessage) {
    return res.status(400).json({ error: 'Missing email or message.' });
  }

  loadUserHealthContext(db, email, async (err, context) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to send chat message.' });
    }

    if (!context) {
      return res.status(404).json({ error: 'User not found.' });
    }

    db.chat_messages.find({ user_id: context.userId })
      .sort({ created_at: 1 })
      .limit(12)
      .exec(async (historyErr, historyRows) => {
        if (historyErr) {
          console.error(historyErr);
          return res.status(500).json({ error: 'Failed to load chat history.' });
        }

        const chatContext = buildChatContext({
          userName: context.userName,
          profile: context.profile,
          goals: context.goals,
          preferences: context.preferences,
          records: context.records,
        });

        insertChatMessage(context.userId, 'user', normalizedMessage, async (userErr, userMessage) => {
          if (userErr) {
            console.error(userErr);
            return res.status(500).json({ error: 'Failed to save user message.' });
          }

          try {
            const replyText = await generateAssistantReply({
              message: normalizedMessage,
              history: (historyRows || []).map((row) => ({ role: row.role, text: row.text })),
              context: chatContext,
            });

            insertChatMessage(context.userId, 'assistant', replyText, (assistantErr, assistantMessage) => {
              if (assistantErr) {
                console.error(assistantErr);
                return res.status(500).json({ error: 'Failed to save assistant message.' });
              }

              res.status(201).json({
                userMessage,
                assistantMessage,
              });
            });
          } catch (replyErr) {
            console.error(replyErr);
            res.status(500).json({ error: 'Failed to generate assistant reply.' });
          }
        });
      });
  });
});

const server = app.listen(PORT, '0.0.0.0',() => {
  console.log(`FoodSense backend listening at http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to a free port.`);
  } else {
    console.error('Failed to start server', err);
  }
  process.exit(1);
});
