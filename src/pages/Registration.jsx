import React, { useState } from 'react';

function Registration() {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    course: '',
    email: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📤 Submitting form data:", formData);

    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        console.log("📥 Server responded with status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("✅ Server response data:", data);
        setMessage(data.message);
      })
      .catch(err => {
        console.error("❌ Error during registration:", err);
        setMessage('Registration failed');
      });
  };

  return (
    <div>
      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>Student ID:</label>
        <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required />

        <label>Full Name:</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

        <label>Select Course:</label>
        <select name="course" value={formData.course} onChange={handleChange} required>
          <option value="">--Select a Course--</option>
          <option value="Intro to Programming">Intro to Programming</option>
          <option value="Data Structures">Data Structures</option>
          <option value="Web Development">Web Development</option>
        </select>

        <label>Email Address:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Registration;
