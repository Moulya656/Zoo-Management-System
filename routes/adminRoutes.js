const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const Ticket = require('../models/Ticket');
const { requireAdmin } = require('../middleware/auth');
const upload = require('../config/upload');

// All admin routes require an admin-role session
router.use(requireAdmin);

// ---------- DASHBOARD: list all animals ----------
router.get('/', async (req, res) => {
  const animals = await Animal.find().sort({ category: 1, name: 1 });
  res.render('admin-dashboard', { animals });
});

// ---------- ADD ANIMAL ----------
router.get('/add', (req, res) => {
  res.render('admin-form', { animal: null, error: null, formAction: '/admin/add' });
});

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, category, scientificName, species, lifespan, description, caption } = req.body;

    if (!req.file) {
      return res.render('admin-form', {
        animal: req.body,
        error: 'Please upload an image.',
        formAction: '/admin/add'
      });
    }

    const imagePath = 'images/uploads/' + req.file.filename;

    await Animal.create({
      name, category, scientificName, species, lifespan, description, caption, imagePath
    });

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.render('admin-form', {
      animal: req.body,
      error: 'Something went wrong while saving. Please check all fields.',
      formAction: '/admin/add'
    });
  }
});

// ---------- EDIT ANIMAL ----------
router.get('/edit/:id', async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  if (!animal) return res.status(404).send('Animal not found.');
  res.render('admin-form', { animal, error: null, formAction: '/admin/edit/' + animal._id });
});

router.post('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, category, scientificName, species, lifespan, description, caption } = req.body;
    const updateData = { name, category, scientificName, species, lifespan, description, caption };

    if (req.file) {
      updateData.imagePath = 'images/uploads/' + req.file.filename;
    }

    await Animal.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong while updating.');
  }
});

// ---------- DELETE ANIMAL ----------
router.post('/delete/:id', async (req, res) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong while deleting.');
  }
});

// ---------- TICKET BOOKINGS: list all ----------
router.get('/tickets', async (req, res) => {
  const tickets = await Ticket.find().sort({ visitDate: 1, createdAt: -1 });
  res.render('admin-tickets', { tickets });
});

// ---------- MARK TICKET AS USED / CANCELLED ----------
router.post('/tickets/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['booked', 'used', 'cancelled'].includes(status)) {
      return res.status(400).send('Invalid status.');
    }
    await Ticket.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin/tickets');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong updating ticket status.');
  }
});

module.exports = router;
