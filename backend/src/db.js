const fs = require('fs');
const path = require('path');

const FILE = process.env.DATA_FILE || path.join(__dirname, '..', 'data.json');

// Tiny JSON-file store. Good enough for a demo / assignment, no native deps.
const state = { users: [], carts: {}, orders: [] };

try {
  Object.assign(state, JSON.parse(fs.readFileSync(FILE, 'utf8')));
} catch (_) {
  /* first run - start empty */
}

function save() {
  try {
    fs.writeFileSync(FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error('Could not persist data:', err.message);
  }
}

function nextId(list) {
  return list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1;
}

module.exports = { state, save, nextId };
