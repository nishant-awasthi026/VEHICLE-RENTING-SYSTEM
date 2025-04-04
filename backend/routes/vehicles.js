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

// Add vehicle (only for owners)
router.post('/', authenticate, (req, res) => {
  if (req.user.role !== 'Owner') return res.status(403).json({ message: 'Forbidden' });
  const { make, model, year, type, licensePlate, description, pricePerDay, location } = req.body;
  db.query(
    'INSERT INTO Vehicles (OwnerID, Make, Model, Year, Type, LicensePlate, Description, PricePerDay, IsListed, Location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?)',
    [req.user.userId, make, model, year, type, licensePlate, description, pricePerDay, location],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Vehicle added' });
    }
  );
});

// Get all available vehicles
router.get('/', (req, res) => {
  db.query('SELECT * FROM Vehicles WHERE IsListed = TRUE', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;