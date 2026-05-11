# Cursed Cards

Browser based game similar to Cards against Humanity with the option to:
- Adding / editing custom cards
- TTS reveal of submissions
- Lobby system
- Winning Screen
- 2 minutes timer for reconnect if server issues / accidental page refresh
- Mobile and big screens friendly
- Kicking players
- Volume controls

if cloning create .env inside server and client folder (according to .env.template)
VITE_API_URL= is url to server

You must have installed CZ language pack on your OS for czech TTS.

Use turso for database and fill .env

Available here: https://cursed-cards-eight.vercel.app/
as it is using free hosting for backend and frontend, the backend needs like 30s to load if the page was not open for a longer  time.
Database is now hosted too, free hosting as well - slower admin menu
