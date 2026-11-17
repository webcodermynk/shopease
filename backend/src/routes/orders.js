const express = require('express');
const { state, save, nextId } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { view } = require('./cart');

const router = express.Router();
router.use(requireAuth);

router.post('/', (req, res) => {
  const address = String(req.body.address || '').trim();
  if (address.length < 8) {
    return res.status(400).json({ error: 'Please enter a full delivery address.' });
  }

  const cart = view(req.user.id);
  if (!cart.items.length) return res.status(400).json({ error: 'Your cart is empty.' });

  const order = {
    id: nextId(state.orders),
    userId: req.user.id,
    address,
    items: cart.items.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      emoji: i.product.emoji,
      price: i.product.price,
      qty: i.qty
    })),
    total: cart.total,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  state.orders.push(order);
  state.carts[req.user.id] = [];
  save();
  res.status(201).json(order);
});

router.get('/', (req, res) => {
  const mine = state.orders
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => b.id - a.id);
  res.json(mine);
});

module.exports = router;
