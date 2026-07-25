require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const connectDB = require('./config/db');
const { attachUser } = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const animalRoutes = require('./routes/animalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// ---------- Database ----------
connectDB();

// ---------- View engine ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- Middleware ----------
app.use(express.urlencoded({ extended: true })); // parse form submissions
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve css/images

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_dev_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
}));

app.use(attachUser); // makes res.locals.currentUser available in every view

// ---------- Routes ----------
app.use('/', authRoutes);       // /login, /register, /logout
app.use('/admin', adminRoutes); // /admin, /admin/add, /admin/edit/:id, /admin/delete/:id, /admin/tickets
app.use('/', ticketRoutes);     // /tickets/book, /tickets/confirmation/:id (must come before animalRoutes)
app.use('/', animalRoutes);     // / (home) and /herbivores, /carnivores, etc. (has a catch-all /:category route)

// ---------- 404 fallback ----------
app.use((req, res) => {
  res.status(404).send('Page not found.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🦁 ZooMS server running at http://localhost:${PORT}`);
});
