# Cursed Cards

Cursed Cards is a browser-based multiplayer party game inspired by classic fill-in-the-blank card games, built with Vue 3, Node.js, Socket.IO and SQLite/Turso.

The project focuses on real-time multiplayer flow, lobby management, custom card administration, reconnect handling, animated reveals, voting, scoring and a polished game-over screen.

> ⚠️ Content note  
> The public demo uses a live card database created for a private friend group. Some cards may contain NSFW humor or inside jokes. The repository is primarily intended to showcase the code, architecture and gameplay systems. Screenshots below use safer examples.

## Features

- Real-time multiplayer lobby system
- Custom card creation, editing and deletion through an admin panel
- White/black card gameplay with multi-blank support
- Voting phase and score tracking
- TTS reveal of player submissions
- Animated game-over / winner screen
- Player kick support
- 2-minute reconnect window for refreshes or temporary socket drops
- Volume controls
- Mobile and large-screen friendly layout

## Tech Stack

- Vue 3
- Node.js
- Socket.IO
- SQLite / Turso
- Vercel frontend hosting
- Render backend hosting

## Live Demo

Available here: https://cursed-cards-eight.vercel.app/

The app uses free hosting, so the backend may take around 30 seconds to wake up after inactivity. The database is also hosted on a free tier, so some admin/game actions may be slower.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Kenedian/CursedCards.git
cd CursedCards
```

### 2. Install dependencies

Open two terminals.

Terminal 1:

```bash
cd client
npm install
```

Terminal 2:

```bash
cd server
npm install
```

### 3. Create environment files

Both the `client` and `server` folders contain `.env.template` files.

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Create `server/.env`:

```env
ADMIN_PASSWORD=your_password
PORT=3000
CLIENT_URL=http://localhost:5173
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

### 4. Start the development servers

Terminal 1:

```bash
cd client
npm run dev
```

Terminal 2:

```bash
cd server
npm run dev
```

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:3000
```

## Environment Variables

### Client

`VITE_API_URL`
- URL of the backend server

### Server

`ADMIN_PASSWORD`
- Password for the admin panel

`PORT`
- Backend server port

`CLIENT_URL`
- Frontend URL used for CORS/socket connections

`TURSO_DATABASE_URL`
- Turso database URL

`TURSO_AUTH_TOKEN`
- Turso authentication token

- Turso offers free hobby SQLite hosting here: https://turso.tech/

## Screenshots

# Main Menu
<img width="1918" height="866" alt="image" src="https://github.com/user-attachments/assets/93391aa8-d020-4202-9ae6-cc2ebcf583c3" />

# Lobby
<img width="1918" height="863" alt="image" src="https://github.com/user-attachments/assets/6ef2e84c-e684-4644-a823-ccf658a400a2" />

# Game (Picking Phase)
<img width="1918" height="863" alt="image" src="https://github.com/user-attachments/assets/7e0f5b98-81cb-46ee-b678-759cf0dcee88" />

# Game (Voting Phase)
<img width="1918" height="866" alt="image" src="https://github.com/user-attachments/assets/75b1f1d8-9ccd-4dd8-ba8e-612893083c1e" />

# Game (Results Phase)
<img width="1918" height="862" alt="image" src="https://github.com/user-attachments/assets/9e83b7d5-c9ef-4f77-b2ae-940517b1361d" />

# Game (Game-over Screen)
<img width="1918" height="857" alt="image" src="https://github.com/user-attachments/assets/4bbc269d-2fee-432a-846d-12e1c7f8f572" />

# Admin Panel (Create Card)
<img width="1918" height="863" alt="image" src="https://github.com/user-attachments/assets/fe13023e-e4a6-4f59-b564-930a59bfcc76" />

# Admin Panel (Browse Cards)
<img width="1918" height="861" alt="image" src="https://github.com/user-attachments/assets/3416177e-6194-4eac-b265-8c3bf00dd04e" />

# Settings Modal
<img width="682" height="702" alt="image" src="https://github.com/user-attachments/assets/d6603af5-ca36-4bbd-8f69-8f59aca9d7c4" />

