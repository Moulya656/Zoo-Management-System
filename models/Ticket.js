const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketCode: { type: String, required: true, unique: true }, // e.g. ZOOMS-8F3K2A
  visitorName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  visitDate: { type: Date, required: true },
  adultCount: { type: Number, required: true, min: 0, default: 1 },
  childCount: { type: Number, required: true, min: 0, default: 0 },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['booked', 'cancelled', 'used'], default: 'booked' },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null if guest checkout
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
