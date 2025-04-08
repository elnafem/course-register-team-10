const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 5001;

// ===== CORS CONFIG =====
const corsOptions = {
  origin: '*', // Updated for testing
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};



app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight OPTIONS
app.use(express.json()); // Parse incoming JSON

// ===== MYSQL CONNECTION =====
const db = mysql.createConnection({
  host: 'database-1.cem8ixjdggjn.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'password123',
  database: 'classgive_db',
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// ===== API ROUTES =====
app.post('/api/register', (req, res) => {
  console.log('📥 Incoming registration:', req.body);
  const { studentId, fullName, course, email } = req.body;

  if (!studentId || !fullName || !course || !email) {
    console.warn("⚠️ Missing fields in request body:", req.body);
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO registrations (studentId, fullName, course, email, registered_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(sql, [studentId, fullName, course, email], (err, result) => {
    if (err) {
      console.error('❌ MySQL insert failed:', err.sqlMessage || err.message);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    console.log('✅ Registration saved:', req.body);
    res.json({ message: `Successfully registered ${fullName} for ${course}.` });
  });
});

// ===== HANDLE UNKNOWN API ROUTES =====
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// ===== SERVE REACT FRONTEND =====
app.use(express.static(path.join(__dirname, '../build')));

// ===== CATCH-ALL FOR SPA ROUTING =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// ===== START SERVER =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
