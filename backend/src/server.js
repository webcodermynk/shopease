require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const allowed = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // allow curl/Postman (no origin), listed origins, "*" and Vercel preview URLs
      const ok =
        !origin ||
        allowed.includes('*') ||
        allowed.includes(origin) ||
        (allowed.includes('vercel-previews') && /\.vercel\.app$/.test(origin));
      cb(null, ok);
    }
  })
);
app.use(express.json());

app.get('/', (_req, res) => res.json({ name: 'ShopEase API', status: 'ok' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our side.' });
});

app.listen(PORT, () => console.log(`ShopEase API running on port ${PORT}`));
