const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register user
router.post('/register', async (req, res) => {
  const { username, password, email, phone, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO Users (Username, Password, Email, Phone, Role) VALUES (?, ?, ?, ?, ?)',
    [username, hashedPassword, email, phone, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'User registered' });
    }
  );
});

// Login user
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM Users WHERE Username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.UserID, role: user.Role }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  });
});

module.exports = router;