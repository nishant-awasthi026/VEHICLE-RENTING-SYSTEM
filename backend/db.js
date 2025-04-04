const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'mySQLpass123@', 
  database: 'vehicle_renting'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = connection;