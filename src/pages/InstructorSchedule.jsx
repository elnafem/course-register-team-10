import React, { useState } from 'react';

function InstructorSchedule() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://ec2-54-175-116-227.compute-1.amazonaws.com:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      const instructorId = data.instructorId;

      const scheduleRes = await fetch(`http://ec2-54-175-116-227.compute-1.amazonaws.com:5001/api/schedule?instructorId=${instructorId}`);
      const scheduleData = await scheduleRes.json();

      setSessions(scheduleData);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      setError('Invalid credentials or server error.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Instructor Schedule</h2>
      {!loggedIn ? (
        <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: 'auto' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email:</label><br />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Password:</label><br />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <div>
          <h3>✅ Logged In</h3>
          <p>Welcome! Here is your current teaching schedule:</p>

          {sessions.length === 0 ? (
            <p>No scheduled classes found.</p>
          ) : (
            <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginTop: '1rem', width: '100%' }}>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr key={index}>
                    <td>{session.course_name}</td>
                    <td>{session.date_time}</td>
                    <td>{session.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default InstructorSchedule;
