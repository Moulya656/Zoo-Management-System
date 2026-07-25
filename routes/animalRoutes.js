const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');

// ---------- HOME PAGE ----------
router.get('/', (req, res) => {
  res.render('index');
});

// ---------- CATEGORY PAGES ----------
// One reusable handler for all 5 categories, so we don't repeat code.
const categoryMap = {
  herbivores: { dbValue: 'Herbivore', title: 'Herbivores' },
  carnivores: { dbValue: 'Carnivore', title: 'Carnivores' },
  omnivores: { dbValue: 'Omnivore', title: 'Omnivores' },
  birds: { dbValue: 'Bird', title: 'Birds' },
  reptiles: { dbValue: 'Reptile', title: 'Reptiles' }
};

router.get('/:category', async (req, res, next) => {
  const key = req.params.category.toLowerCase();
  const info = categoryMap[key];

  if (!info) return next(); // not a category route, fall through to 404

  try {
    const animals = await Animal.find({ category: info.dbValue }).sort({ name: 1 });
    res.render('category', { pageTitle: info.title, animals });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading animals.');
  }
});

module.exports = router;
