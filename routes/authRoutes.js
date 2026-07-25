const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ---------- REGISTER ----------
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.render('register', { error: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return res.render('register', { error: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.render('register', { error: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.render('register', { error: 'Username or email is already taken.' });
    }

    // First-ever registered user automatically becomes admin so you have
    // someone who can manage the site. Everyone after that is a visitor.
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'visitor';

    const newUser = new User({ username, email, password, role });
    await newUser.save();

    req.session.user = { id: newUser._id, username: newUser.username, role: newUser.role };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Something went wrong. Please try again.' });
  }
});

// ---------- LOGIN ----------
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.render('login', { error: 'Invalid username or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid username or password.' });
    }

    req.session.user = { id: user._id, username: user.username, role: user.role };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Something went wrong. Please try again.' });
  }
});

// ---------- LOGOUT ----------
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
