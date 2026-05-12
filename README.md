# Cursed Cards

Cursed Cards is a browser-based multiplayer party game inspired by Cards Against Humanity, built with Vue 3, Node.js, Socket.IO and SQLite/Turso.

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

## Setup

Clone the repository and create `.env` files inside both the `client` and `server` folders using the provided `.env.template` files.

## Screenshots

# Main Menu
<img width="1918" height="860" alt="image" src="https://github.com/user-attachments/assets/2fa8791f-e306-44db-bd26-cfabc82325d8" />

# Lobby
<img width="1918" height="871" alt="image" src="https://github.com/user-attachments/assets/130687ad-6a25-4cb1-a464-b9ad4b3bf456" />

# Game (Picking Phase)
<img width="1918" height="868" alt="image" src="https://github.com/user-attachments/assets/e33b3258-fc74-4054-9c90-4a8609b8bb05" />

# Game (Voting Phase)
<img width="1917" height="862" alt="image" src="https://github.com/user-attachments/assets/a3107101-40c7-4071-8712-52336b3e87b1" />

# Game (Results Phase)
<img width="1918" height="863" alt="image" src="https://github.com/user-attachments/assets/11fd6069-9ad1-461b-bc7b-afb0e3519cd1" />

# Game (Game-over Screen)
<img width="1918" height="863" alt="image" src="https://github.com/user-attachments/assets/3e77ee31-4c0f-4cd1-b600-19a7720acfee" />

# Admin Panel (Create Card)
<img width="1918" height="863" alt="image" src="https://github.com/user-attachments/assets/fe13023e-e4a6-4f59-b564-930a59bfcc76" />

# Admin Panel (Browse Cards)
<img width="1918" height="861" alt="image" src="https://github.com/user-attachments/assets/3416177e-6194-4eac-b265-8c3bf00dd04e" />

# Settings Modal
<img width="677" height="612" alt="image" src="https://github.com/user-attachments/assets/ebdec994-d250-49a7-91f1-eb46e396b1e0" />
