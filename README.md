# Zoo Management System (ZooMS)

A full-stack Zoo Management System built with **Node.js + Express + MongoDB + EJS**.
No XAMPP, no Apache, no phpMyAdmin needed.

## Features
- Home page + 5 category pages (Herbivores, Carnivores, Omnivores, Birds, Reptiles) — animal
  data is pulled live from MongoDB, not hardcoded in HTML
- User registration and login with securely hashed passwords (bcrypt) and sessions
- The very first person who registers automatically becomes **admin**; everyone after
  that registers as a normal visitor
- Admin panel to **Add / Edit / Delete** animals, including image upload
- All the bugs from the original static HTML/CSS version are fixed (see "Bugs fixed" below)

---

## 1. Install prerequisites

You only need **one** thing installed: **Node.js** (which includes npm).
Download it from https://nodejs.org (LTS version). Verify it worked:
```
node -v
npm -v
```

You do **NOT** need to install Apache, PHP, or XAMPP.

## 2. Get a MongoDB database (easiest option — no install at all)

Use **MongoDB Atlas**, a free cloud database:
1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free "M0" cluster (takes ~2 minutes to spin up).
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, click "Add IP Address" → "Allow access from anywhere" (0.0.0.0/0) — fine for a student project.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the ones you created, and add `/zoomsDB` before the `?` so it saves to a database named zoomsDB:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/zoomsDB?retryWrites=true&w=majority
   ```

**Alternative:** if you'd rather run MongoDB on your own computer instead of the cloud,
install "MongoDB Community Server" from https://www.mongodb.com/try/download/community
and use `mongodb://127.0.0.1:27017/zoomsDB` as your connection string instead.

## 3. Configure the project

1. In the project folder, copy `.env.example` to a new file named `.env`:
   ```
   cp .env.example .env
   ```
2. Open `.env` and paste your MongoDB connection string into `MONGO_URI`.
3. Set `SESSION_SECRET` to any random long string (mash your keyboard).

## 4. Add your animal images

Copy your original `image` folder contents into `public/images/`.
**Important:** rename any file that has spaces in its name, replacing spaces with
hyphens (this was a bug in the original project — spaces in file paths break on
the web). For example:
```
white peacock.webp   ->  white-peacock.webp
white tiger.jpeg      ->  white-tiger.jpeg
front page.png        ->  front-page.png
green snake.jpeg      ->  green-snake.jpeg
```
The `seed.js` file already expects these exact hyphenated names.

## 5. Install dependencies and seed the database

```
npm install
npm run seed
```
`npm run seed` fills your MongoDB database with all the animals from your original
project (Panda, Cheetah, Lion, Owl, Cobra, etc.) so you don't have to type them all
in again through the admin panel.

## 6. Run the project

```
npm start
```
Then open your browser to **http://localhost:3000**

For development (auto-restarts when you edit a file):
```
npm run dev
```

## 7. Using the app

1. Go to `/register` and create the **first** account — it automatically becomes admin.
2. Log in, then click **"Admin Panel"** in the top navigation.
3. From there you can **Add**, **Edit**, or **Delete** any animal, including uploading
   a new photo for it.
4. Any further accounts you register will be normal visitors (no admin panel access)
   — this simulates real zoo staff vs. public website visitors.

---

## Project structure
```
zoo-management-system/
├── server.js              # app entry point
├── seed.js                # populates the database with starter animal data
├── package.json
├── .env.example            # copy to .env and fill in your own values
├── config/
│   ├── db.js               # MongoDB connection
│   └── upload.js           # image upload (multer) configuration
├── models/
│   ├── User.js              # user schema + password hashing
│   └── Animal.js            # animal schema
├── middleware/
│   └── auth.js              # login/admin route protection
├── routes/
│   ├── authRoutes.js         # /register /login /logout
│   ├── animalRoutes.js       # / and /herbivores /carnivores /omnivores /birds /reptiles
│   └── adminRoutes.js        # /admin CRUD routes
├── views/                    # EJS templates (dynamic HTML)
│   ├── partials/header.ejs & footer.ejs
│   ├── index.ejs, category.ejs, login.ejs, register.ejs
│   └── admin-dashboard.ejs, admin-form.ejs
└── public/
    ├── css/styles.css
    └── images/                # put your animal photos here
```

---

## Bugs fixed from your original static version

1. **Broken image paths using backslashes** (`image\front page.png`, `\image\giraffe.jpeg`,
   etc.) — the web only understands forward slashes. All paths fixed and file names with
   spaces renamed with hyphens.
2. **Invalid CSS** — `style="width:\60%; height: 212px;"` on the jaguar image in
   Carnivores.html was broken CSS syntax; fixed to `width:70%`.
3. **Duplicate/conflicting `.hero` CSS rules** — your original `styles.css` had five
   separate `.hero { ... }` blocks (one pasted per page: Reptiles, Carnivores, Birds,
   Herbivores as `.h`, Omnivores). Because CSS rules apply in the order they appear,
   only the last one (Omnivores) was actually winning for shared properties like
   padding and background — so your other pages weren't rendering the way you intended.
   This is now a single clean `.hero` rule used consistently across all pages.
4. **Dead link to `forgot-password.html`** in login.html — page never existed. Removed
   until/unless you want to build a real password-reset flow.
5. **register.html had no `action`/`method` on its form** — it couldn't actually submit
   anywhere. Now posts to `/register` and creates a real hashed-password account in
   MongoDB.
6. **login.html posted to `/login` with no server to receive it** — now there's a real
   Express route that checks the hashed password and starts a session.
7. **No database at all** — all animal info was hardcoded directly into each HTML file,
   meaning "editing the zoo" meant editing raw HTML. Now animals live in MongoDB and
   are rendered dynamically, and there's a real Add/Edit/Delete admin interface — the
   actual "management" part of "Zoo Management System."

---

## Notes for your report / viva
- **Password security:** passwords are never stored in plain text — `bcryptjs` hashes
  them before saving (see `models/User.js`).
- **Sessions:** `express-session` keeps track of who's logged in via a cookie; `/logout`
  destroys that session.
- **Role-based access control:** `middleware/auth.js`'s `requireAdmin` blocks anyone
  without `role: 'admin'` from reaching `/admin` routes.
- **File uploads:** handled by `multer` (see `config/upload.js`), which validates file
  type/size and saves images to `public/images/uploads/`.
- This is a good stopping point for a college project, but in a real production app
  you'd also want: input sanitization, rate-limiting on login attempts, HTTPS, and a
  persistent session store (e.g. `connect-mongo`) instead of the default in-memory one.
