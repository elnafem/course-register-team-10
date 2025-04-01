import React, { useState } from 'react';

function Registration() {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    course: '',
    email: ''
  });

  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Submitting...');

    // ✅ Live EC2 backend URL
    fetch('http://ec2-54-242-138-219.compute-1.amazonaws.com:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("✅ Success:", data);
        setMessage(data.message || 'Registration successful!');
        // Clear form (optional)
        setFormData({
          studentId: '',
          fullName: '',
          course: '',
          email: ''
        });
      })
      .catch(err => {
        console.error("❌ Registration error:", err);
        setMessage('Registration failed. Please try again later.');
      });
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>📘 Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>Student ID:</label>
        <input
          type="text"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          required
        />

        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label>Select Course:</label>
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
        >
          <option value="">--Select a Course--</option>
          <option value="Intro to Programming">Intro to Programming</option>
          <option value="Data Structures">Data Structures</option>
          <option value="Web Development">Web Development</option>
        </select>

        <label>Email Address:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}

export default Registration;
