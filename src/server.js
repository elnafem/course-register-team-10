const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 5001;

// ===== MIDDLEWARE =====
app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

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

// ===== /api/login =====
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Login attempt:", email);

  if (!email || !password) {
    console.warn("❗ Missing email or password");
    return res.status(400).json({ message: 'Missing email or password' });
  }

  const userQuery = `
    SELECT user_id, email, first_name, last_name, role, password_hash
    FROM Users
    WHERE email = ? AND role = 'instructor'
  `;

  db.query(userQuery, [email], (err, results) => {
    if (err) {
      console.error("Database error during user lookup:", err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      console.warn("❗ No instructor found with that email.");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    console.log("Instructor found:", user.email, "ID:", user.user_id);

    if (password !== user.password_hash) {
      console.warn("❗ Password mismatch for user:", user.email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const sectionCheck = `SELECT 1 FROM Sections WHERE instructor_id = ? LIMIT 1`;
    db.query(sectionCheck, [user.user_id], (err, sectionResult) => {
      if (err) {
        console.error("❌ Error checking section assignment:", err);
        return res.status(500).json({ message: 'Database error (section check)' });
      }

      if (sectionResult.length === 0) {
        console.warn("❗ Instructor not assigned to any section:", user.user_id);
        return res.status(403).json({ message: 'You are not assigned to any courses yet.' });
      }

      console.log("✅ Instructor login successful:", user.email);
      res.json({
        message: 'Login successful',
        instructorId: user.user_id,
        fullName: `${user.first_name} ${user.last_name}`
      });
    });
  });
});

// ===== /api/schedule =====
app.get('/api/schedule', (req, res) => {
  const { instructorId } = req.query;
  console.log("📘 Fetching schedule for instructorId:", instructorId);

  const sql = `
    SELECT 
      c.course_name,
      c.date_time,
      s.location
    FROM Sections s
    JOIN Courses c ON s.course_id = c.course_id
    WHERE s.instructor_id = ?
  `;

  db.query(sql, [instructorId], (err, results) => {
    if (err) {
      console.error("❌ Error in schedule query:", err);
      return res.status(500).json({ message: 'Database error' });
    }

    console.log("📋 Schedule results:", results);
    res.json(results);
  });
});

// ===== /api/courses =====
app.get('/api/courses', (req, res) => {
  const { department, course_number, course_name } = req.query;

  let sql = `SELECT course_number, course_name, department, credit_hours, modality FROM Courses WHERE 1=1`;
  const params = [];

  if (department) {
    sql += " AND department LIKE ?";
    params.push(`%${department}%`);
  }
  if (course_number) {
    sql += " AND course_number LIKE ?";
    params.push(`%${course_number}%`);
  }
  if (course_name) {
    sql += " AND course_name LIKE ?";
    params.push(`%${course_name}%`);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ Error fetching courses:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// ===== /api/register =====
app.post('/api/register', (req, res) => {
  const { studentId, fullName, course, email } = req.body;

  if (!studentId || !fullName || !course || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO registrations (studentId, fullName, course, email, registered_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(sql, [studentId, fullName, course, email], (err, result) => {
    if (err) {
      console.error('❌ Registration failed:', err.sqlMessage || err.message);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    console.log('✅ Registration saved:', req.body);
    res.json({ message: `Successfully registered ${fullName} for ${course}.` });
  });
});

// ===== UNKNOWN API HANDLER =====
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// ===== STATIC FRONTEND =====
app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// ===== START SERVER =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
