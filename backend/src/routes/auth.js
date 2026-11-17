const express = require('express');
const bcrypt = require('bcryptjs');
const { state, save, nextId } = require('../db');
const { signToken, requireAuth } = require('../middleware/auth');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

router.post('/signup', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (name.length < 2) return res.status(400).json({ error: 'Please enter your name.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email.' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  if (state.users.some((u) => u.email === email)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const user = {
    id: nextId(state.users),
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString()
  };
  state.users.push(user);
  save();
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const user = state.users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  const user = state.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(401).json({ error: 'Account not found.' });
  res.json({ user: publicUser(user) });
});

module.exports = router;
