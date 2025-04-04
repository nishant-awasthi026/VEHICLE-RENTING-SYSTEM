const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require('./routes/users');
const vehicleRoutes = require('./routes/vehicles');
const bookingRoutes = require('./routes/bookings');

// Use routes
app.use('/users', userRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});