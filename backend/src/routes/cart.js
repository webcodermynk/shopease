const express = require('express');
const products = require('../data/products');
const { state, save } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const MAX_QTY = 10;

function getCart(userId) {
  if (!state.carts[userId]) state.carts[userId] = [];
  return state.carts[userId];
}

function view(userId) {
  const items = getCart(userId)
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      return product ? { product, qty: line.qty, subtotal: product.price * line.qty } : null;
    })
    .filter(Boolean);
  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  return { items, total, count };
}

router.get('/', (req, res) => res.json(view(req.user.id)));

router.post('/', (req, res) => {
  const productId = Number(req.body.productId);
  const qty = Math.max(1, Math.min(MAX_QTY, Number(req.body.qty) || 1));
  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  const cart = getCart(req.user.id);
  const line = cart.find((l) => l.productId === productId);
  if (line) line.qty = Math.min(MAX_QTY, line.qty + qty);
  else cart.push({ productId, qty });
  save();
  res.json(view(req.user.id));
});

router.patch('/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const qty = Number(req.body.qty);
  const cart = getCart(req.user.id);
  const line = cart.find((l) => l.productId === productId);
  if (!line) return res.status(404).json({ error: 'Item is not in your cart.' });
  if (!Number.isFinite(qty)) return res.status(400).json({ error: 'Invalid quantity.' });

  if (qty <= 0) state.carts[req.user.id] = cart.filter((l) => l.productId !== productId);
  else line.qty = Math.min(MAX_QTY, Math.floor(qty));
  save();
  res.json(view(req.user.id));
});

router.delete('/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  state.carts[req.user.id] = getCart(req.user.id).filter((l) => l.productId !== productId);
  save();
  res.json(view(req.user.id));
});

router.delete('/', (req, res) => {
  state.carts[req.user.id] = [];
  save();
  res.json(view(req.user.id));
});

module.exports = router;
module.exports.view = view;
