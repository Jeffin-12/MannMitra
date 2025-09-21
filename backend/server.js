require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');
const path = require('path');

// Routes
const chatRouter = require('./routes/chat');
const resourcesRouter = require('./routes/resources');

const app = express();
const PORT = process.env.PORT || 8080;

// DB
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDb() {
  await db.read();
  db.data = db.data || { sessions: [] };
  await db.write();
}
initDb();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120
});
app.use(limiter);

// attach db to request
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/api/chat', chatRouter);
app.use('/api/resources', resourcesRouter);

// simple route to create anonymous session
app.post('/api/session', async (req, res) => {
  const anonPrefix = process.env.ANON_PREFIX || 'MM_';
  const id = anonPrefix + nanoid(10);
  await req.db.read();
  req.db.data.sessions.push({ id, createdAt: Date.now(), logs: [] });
  await req.db.write();
  res.json({ sessionId: id });
});

app.listen(PORT, () => {
  console.log(`MannMitra backend running on ${PORT}`);
});
