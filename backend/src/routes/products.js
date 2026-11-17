const express = require('express');
const products = require('../data/products');

const router = express.Router();

router.get('/categories', (_req, res) => {
  res.json([...new Set(products.map((p) => p.category))]);
});

router.get('/', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const category = String(req.query.category || '').trim();
  const sort = String(req.query.sort || '');

  let list = products.filter((p) => {
    const matchesQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchesCat = !category || p.category === category;
    return matchesQ && matchesCat;
  });

  if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
  else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);

  res.json(list);
});

router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json(product);
});

module.exports = router;
