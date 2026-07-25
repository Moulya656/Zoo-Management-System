const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Prices per person (in your local currency)
const ADULT_PRICE = 200;
const CHILD_PRICE = 100;

function generateTicketCode() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ZOOMS-${random}`;
}

// ---------- SHOW BOOKING FORM ----------
router.get('/tickets/book', (req, res) => {
  res.render('book-ticket', {
    error: null,
    adultPrice: ADULT_PRICE,
    childPrice: CHILD_PRICE
  });
});

// ---------- SUBMIT BOOKING ----------
router.post('/tickets/book', async (req, res) => {
  try {
    const { visitorName, email, phone, visitDate, adultCount, childCount } = req.body;

    const adults = parseInt(adultCount, 10) || 0;
    const children = parseInt(childCount, 10) || 0;

    if (!visitorName || !email || !phone || !visitDate) {
      return res.render('book-ticket', {
        error: 'Please fill in all fields.',
        adultPrice: ADULT_PRICE,
        childPrice: CHILD_PRICE
      });
    }

    if (adults + children < 1) {
      return res.render('book-ticket', {
        error: 'Please book at least 1 ticket.',
        adultPrice: ADULT_PRICE,
        childPrice: CHILD_PRICE
      });
    }

    const selectedDate = new Date(visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return res.render('book-ticket', {
        error: 'Visit date cannot be in the past.',
        adultPrice: ADULT_PRICE,
        childPrice: CHILD_PRICE
      });
    }

    const totalPrice = (adults * ADULT_PRICE) + (children * CHILD_PRICE);

    const ticket = await Ticket.create({
      ticketCode: generateTicketCode(),
      visitorName,
      email,
      phone,
      visitDate: selectedDate,
      adultCount: adults,
      childCount: children,
      totalPrice,
      bookedBy: req.session.user ? req.session.user.id : null
    });

    res.redirect('/tickets/confirmation/' + ticket._id);
  } catch (err) {
    console.error(err);
    res.render('book-ticket', {
      error: 'Something went wrong while booking. Please try again.',
      adultPrice: ADULT_PRICE,
      childPrice: CHILD_PRICE
    });
  }
});

// ---------- CONFIRMATION PAGE ----------
router.get('/tickets/confirmation/:id', async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send('Ticket not found.');
  res.render('ticket-confirmation', { ticket });
});

module.exports = router;
