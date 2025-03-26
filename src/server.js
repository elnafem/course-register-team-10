const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { studentId, fullName, course, email } = req.body;
  console.log('Registration Data:', req.body);
  // Placeholder logic - in real use, store this in a DB
  res.json({ message: `Successfully registered ${fullName} for ${course}.` });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
