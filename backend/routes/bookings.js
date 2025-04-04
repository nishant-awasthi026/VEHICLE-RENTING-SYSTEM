const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to check JWT
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Create booking (only for renters)
router.post('/', authenticate, (req, res) => {
  if (req.user.role !== 'Renter') return res.status(403).json({ message: 'Forbidden' });
  const { vehicleId, startDate, endDate } = req.body;
  // Check availability
  db.query(
    'SELECT COUNT(*) as count FROM Bookings WHERE VehicleID = ? AND Status = "Confirmed" AND StartDate < ? AND EndDate > ?',
    [vehicleId, endDate, startDate],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results[0].count > 0) return res.status(400).json({ message: 'Vehicle not available for selected dates' });
      // Calculate total price
      db.query('SELECT PricePerDay FROM Vehicles WHERE VehicleID = ?', [vehicleId], (err, vehicle) => {
        if (err) return res.status(500).json({ error: err.message });
        const pricePerDay = vehicle[0].PricePerDay;
        const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
        const totalPrice = days * pricePerDay;
        // Insert booking
        db.query(
          'INSERT INTO Bookings (VehicleID, RenterID, StartDate, EndDate, TotalPrice, Status) VALUES (?, ?, ?, ?, ?, "Confirmed")',
          [vehicleId, req.user.userId, startDate, endDate, totalPrice],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Booking confirmed' });
          }
        );
      });
    }
  );
});

module.exports = router;