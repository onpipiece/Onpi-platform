# ONPI Platform — Minimal Backend (demo)

Acest repo conține un scaffold minim de backend Express pentru dezvoltare locală.

Quick start:

```bash
cd onpi-platform
npm install
npm start
# apoi deschide http://localhost:3000 în browser
```

Endpoints principale:
- `GET /api/health` — verificare stare API
- `POST /api/register` — body: `{ cont, parola, nume, email, telegram, telefon }`
- `POST /api/login` — body: `{ cont, parola }`
- `GET /api/profile` — header `Authorization: Bearer <token>`

Datele sunt salvate simplu în `data.json` (demo). Pentru producție folosește o bază de date reală și autentificare securizată.

Supabase (recomandat)
--------------------

Poți folosi Supabase în loc de `data.json`. Pași rapizi:

1. Creează un proiect pe https://app.supabase.com
2. În `Table Editor` creează o tabelă `users` cu coloanele:
	- `id` (bigint / or default serial)
	- `cont` (text)
	- `parola` (text)
	- `nume` (text)
	- `email` (text)
	- `telegram` (text)
	- `telefon` (text)
	- `createdAt` (timestamp)
	- `token` (text)
	- `purchased_packages` (text)
	- `active_package` (text)

3. Copiază URL și anon/public key din `Settings → API` și adaugă în `.env` local:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
```

4. Instalează dependențele și rulează:

```bash
npm install
npm start
```

Serverul detectează automat Supabase și va folosi tabela `users`. Pentru producție folosește o cheie service_role numai pe backend și nu expune chei sensibile în browser.

Securitate parole
-----------------

Parolele sunt acum hash-uite pe server (bcrypt). Trimite parola simplă în `POST /api/register` și `POST /api/login` — serverul o va hasha și nu va stoca textul clar. Dacă migrezi din `data.json`, scriptul `migrate_to_supabase.js` va hasha orice câmp `parola` existent.
