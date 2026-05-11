# Cursed Cards

Browser based game similar to Cards against Humanity with the option to:
- Adding / editing custom cards
- TTS reveal of submissions
- Lobby system
- Winning Screen with points system
- Voting for best submissions
- 2 minutes timer for reconnect if server issues / accidental page refresh
- Mobile and big screens friendly
- Kicking players
- Volume controls

<img width="1918" height="860" alt="image" src="https://github.com/user-attachments/assets/2fa8791f-e306-44db-bd26-cfabc82325d8" />
<img width="1918" height="871" alt="image" src="https://github.com/user-attachments/assets/130687ad-6a25-4cb1-a464-b9ad4b3bf456" />
<img width="1918" height="868" alt="image" src="https://github.com/user-attachments/assets/e33b3258-fc74-4054-9c90-4a8609b8bb05" />
<img width="1918" height="863" alt="image" src="https://github.com/user-attachments/assets/fe13023e-e4a6-4f59-b564-930a59bfcc76" />
<img width="1918" height="861" alt="image" src="https://github.com/user-attachments/assets/3416177e-6194-4eac-b265-8c3bf00dd04e" />
<img width="677" height="612" alt="image" src="https://github.com/user-attachments/assets/ebdec994-d250-49a7-91f1-eb46e396b1e0" />



if cloning create .env inside server and client folder (according to .env.template)
VITE_API_URL= is url to server

You must have installed CZ language pack on your OS for czech TTS.

Use turso for database and fill .env

Available here: https://cursed-cards-eight.vercel.app/
- As it is using free hosting for backend and frontend, the backend needs like 30s to load if the page was not open for a longer  time.
Database is now hosted too, free hosting as well - slower admin menu
- Uses Torso for database (free hosting) slower actions in admin panel or game may happen
- Includes a lot of NSFW and inside jokes cards as this live version is intended for our group of friends
- I am not against you hosting this yourself with your own database and cards for personal / group use.
- Please do not host this as public game outside friend groups without letting me know
