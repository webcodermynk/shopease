# 🛍️ ShopEase – Full Stack Mini E-Commerce App

Week 4 – Full Stack & Deployment: React frontend + Node.js/Express backend, login/signup, products + cart, deployed on Vercel (frontend) and Render (backend).

## Features
- **Auth:** signup / login with hashed passwords (bcrypt) and JWT sessions, protected routes
- **Products:** 12 products, search, category filter, sorting, product detail page
- **Cart:** server-side cart per user, quantity controls, live badge in navbar
- **Checkout:** delivery address, order placement, order history
- Responsive UI, toast notifications, loading/error/empty states

## Tech stack
| Part | Tech |
|---|---|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express, JWT, bcryptjs |
| Storage | JSON file (no database setup needed) |
| Hosting | Vercel (frontend), Render (backend) |

## Project structure
```
shopease/
├── backend/            Express API
│   └── src/ (server.js, db.js, routes/, middleware/, data/)
├── frontend/           React app (Vite)
│   └── src/ (pages/, components/, context/, api.js)
├── render.yaml         Render blueprint
└── README.md
```

## Run locally
Requires Node 18+.

```bash
# 1. install everything
npm run install:all

# 2. backend (terminal 1)
cp backend/.env.example backend/.env
npm run dev:backend          # http://localhost:5000

# 3. frontend (terminal 2)
cp frontend/.env.example frontend/.env
npm run dev:frontend         # http://localhost:5173
```
Open http://localhost:5173, sign up, add products to your cart and place an order.

## API reference
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | – | Create account |
| POST | `/api/auth/login` | – | Log in, returns JWT |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/products?q=&category=&sort=` | – | List / search products |
| GET | `/api/products/:id` | – | Product detail |
| GET | `/api/cart` | ✅ | Get cart |
| POST | `/api/cart` | ✅ | Add `{productId, qty}` |
| PATCH | `/api/cart/:productId` | ✅ | Set quantity |
| DELETE | `/api/cart/:productId` | ✅ | Remove item |
| POST | `/api/orders` | ✅ | Place order `{address}` |
| GET | `/api/orders` | ✅ | Order history |

## Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "ShopEase full stack project"
git branch -M main
git remote add origin https://github.com/<your-username>/shopease.git
git push -u origin main
```

### 2. Backend on Render
1. Render dashboard → **New → Web Service** → connect your GitHub repo.
2. Settings: **Root Directory** `backend`, **Build Command** `npm install`, **Start Command** `npm start`.
   (Or use **New → Blueprint** and Render will read `render.yaml`.)
3. Environment variables:
   - `JWT_SECRET` = any long random string
   - `CLIENT_URL` = your Vercel URL (add after step 3; e.g. `https://shopease.vercel.app`)
4. Deploy and copy the URL, e.g. `https://shopease-api.onrender.com`. Check `/api/health`.

### 3. Frontend on Vercel
1. Vercel → **Add New → Project** → import the same repo.
2. **Root Directory:** `frontend` (framework preset: Vite).
3. Environment variable: `VITE_API_URL` = your Render URL (no trailing slash).
4. Deploy. `vercel.json` already handles client-side routing.
5. Go back to Render and set `CLIENT_URL` to the final Vercel URL, then redeploy the backend (CORS).

### 4. Submit
Submit your GitHub repo link (plus the live Vercel link if asked).

## Notes
- Render's free tier sleeps after inactivity; the first request can take ~30s.
- Free Render instances have an ephemeral disk, so users/orders reset on redeploy. For a permanent store, swap `backend/src/db.js` for MongoDB or PostgreSQL – all routes go through that one module.
