const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// ✅ CORS – Allow requests only from your S3 static site
app.use(cors({
  origin: 'https://courseregistrationteam10.s3-website-us-east-1.amazonaws.com'
}));

app.use(express.json());

// ✅ MySQL Connection (adjust if you changed your RDS config)
const db = mysql.createConnection({
  host: 'database-1.cem8ixjdggjn.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'password123',
  database: 'classgive_db'
});

// ✅ Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL DB');
});

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('📡 Backend is running');
});

// ✅ Registration API Endpoint
app.post('/api/register', (req, res) => {
  const { studentId, fullName, course, email } = req.body;

  if (!studentId || !fullName || !course || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  console.log('📩 New registration:', req.body);

  const query = `
    INSERT INTO registrations (studentId, fullName, course, email)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [studentId, fullName, course, email], (err, result) => {
    if (err) {
      console.error('❌ Database insert error:', err);
      return res.status(500).json({ message: 'Database insert failed' });
    }
    res.status(200).json({ message: 'Registration successful!' });
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://ec2-54-242-138-219.compute-1.amazonaws.com:${PORT}`);
});
