import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InstructorSchedule() {
  const [form, setForm] = useState({ instructorId: '', password: '' });
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessions] = useState([
    { course: "Intro to Programming", date: "2025-01-10", time: "10:00 AM", location: "Room 101" },
    { course: "Data Structures", date: "2025-01-12", time: "02:00 PM", location: "Room 202" },
  ]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (form.instructorId === "instructor123" && form.password === "password123") {
      setLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Instructor Schedule</h2>
      {!loggedIn ? (
        <form onSubmit={handleLogin}>
          <label>Instructor ID:</label>
          <input type="text" name="instructorId" value={form.instructorId} onChange={handleChange} required />

          <label>Password:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />

          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <h3>Your Sessions</h3>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={index}>
                  <td>{session.course}</td>
                  <td>{session.date}</td>
                  <td>{session.time}</td>
                  <td>{session.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => navigate('/session-enrollment')}>View Session Enrollment</button>
        </div>
      )}
    </div>
  );
}

export default InstructorSchedule;