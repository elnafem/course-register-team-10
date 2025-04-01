const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: 'database-build.cewp5wkjfwkc.us-east-1.rds.amazonaws.com',    // e.g. localhost or AWS RDS endpoint
  user: 'admin',
  password: 'Moelittle123',
  database: 'classgive_db'
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    return;
  }
  console.log('Connected to MySQL DB');
});

// ✅ Registration API
app.post('/api/register', (req, res) => {
  const { studentId, fullName, course, email } = req.body;
  const query = 'INSERT INTO registrations (studentId, fullName, course, email) VALUES (?, ?, ?, ?)';
  db.query(query, [studentId, fullName, course, email], (err, result) => {
    if (err) {
      console.error('Insert failed:', err);
      return res.status(500).json({ message: 'Database insert failed' });
    }
    res.json({ message: 'Registration successful!' });
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
