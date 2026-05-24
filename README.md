# 📊 GitHub Organization Analytics Dashboard

A full-stack engineering productivity analytics platform built with the MERN stack. Visualize commit trends, PR cycle times, code review stats, team velocity, contributor insights, and repository health — all in a beautiful dark-mode dashboard.

![Tech Stack](https://img.shields.io/badge/React-19-61dafb?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-20-68a063?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-7-4db33d?logo=mongodb) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 GitHub OAuth | Secure login via GitHub OAuth 2.0 |
| 📈 Commit Trends | Weekly/daily commit activity with heatmap |
| 🔄 PR Analytics | Cycle time, merge rate, stale PR detection |
| ⭐ Code Review | Reviewer leaderboard, approval rates |
| ⚡ Team Velocity | Weekly throughput, contributor productivity |
| 👥 Contributors | Ranked contributor cards with commit share |
| ❤️ Repo Health | Health score rings, open issues, PR backlog |
| 🎭 Demo Mode | Explore with realistic mock data — no login needed |
| 🌗 Dark/Light Mode | Persistent theme with smooth transitions |

---

## 🚀 Quick Start

### Option 1: Demo Mode (No Setup Required)

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` and click **"Try Demo Mode"** — no GitHub credentials needed!

---

### Option 2: Full Stack (Local Development)

#### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- GitHub OAuth App

#### 1. GitHub OAuth App Setup

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Set **Homepage URL**: `http://localhost:5173`
4. Set **Callback URL**: `http://localhost:5000/auth/callback`
5. Copy your **Client ID** and **Client Secret**

#### 2. Environment Setup

```bash
cp .env.example server/.env
```

Edit `server/.env`:
```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
JWT_SECRET=any_long_random_string
SESSION_SECRET=another_long_random_string
MONGODB_URI=mongodb://localhost:27017/github-analytics
CLIENT_URL=http://localhost:5173
PORT=5000
```

#### 3. Install & Run

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

Open `http://localhost:5173` ✅

---

### Option 3: Docker Compose (Production-like)

```bash
# Copy and fill in your credentials
cp .env.example .env

# Build and start all 3 containers
docker compose up --build

# App runs at http://localhost:3000
```

---

## 📁 Project Structure

```
PEP project/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Layout, charts, cards
│   │   ├── pages/         # 8 dashboard pages
│   │   ├── context/       # Auth & Org context
│   │   ├── hooks/         # Analytics, dark mode
│   │   ├── services/      # Axios API layer
│   │   └── utils/         # Helpers & mock data
│   └── Dockerfile
├── server/                 # Node.js + Express backend
│   ├── config/            # DB, Passport
│   ├── controllers/       # Auth, Orgs, Analytics
│   ├── models/            # User, Org, Analytics
│   ├── routes/            # REST endpoints
│   ├── services/          # GitHub API client
│   └── Dockerfile
└── docker-compose.yml
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/github` | Initiate GitHub OAuth |
| GET | `/auth/callback` | OAuth callback |
| POST | `/auth/logout` | Sign out |
| GET | `/auth/me` | Current user |
| GET | `/api/orgs` | List user's orgs |
| GET | `/api/orgs/:org` | Org details + repos |
| GET | `/api/analytics/commits` | Commit trend data |
| GET | `/api/analytics/prs` | PR cycle analysis |
| GET | `/api/analytics/reviews` | Code review stats |
| GET | `/api/analytics/velocity` | Team velocity |
| GET | `/api/analytics/health` | Repo health metrics |

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Chart.js, React Router, Lucide Icons
- **Backend**: Node.js, Express.js, Passport.js (GitHub OAuth)
- **Database**: MongoDB + Mongoose (with TTL caching)
- **Auth**: JWT cookies + GitHub OAuth 2.0
- **DevOps**: Docker + Docker Compose + Nginx

---

## 📄 License

MIT © 2026 PEP Engineering
