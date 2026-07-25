const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Herbivore', 'Carnivore', 'Omnivore', 'Bird', 'Reptile']
  },
  scientificName: { type: String, required: true },
  species: { type: String, required: true },
  lifespan: { type: String, required: true },
  description: { type: String, required: true },
  caption: { type: String, required: true },
  // stored relative to /public, e.g. "images/uploads/lion.jpg"
  imagePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Animal', animalSchema);
