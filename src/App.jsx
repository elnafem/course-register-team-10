import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Registration from './pages/Registration';
import CourseSearch from './pages/CourseSearch';
import InstructorSchedule from './pages/InstructorSchedule';
import SessionEnrollment from './pages/SessionEnrollment';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>📘 Course Registration System</h1>
          <nav className="navbar">
            <Link to="/">🏠 Home</Link>
            <Link to="/search">🔍 Search Courses</Link>
            <Link to="/register">📝 Student Registration</Link>
            <Link to="/instructor">👨‍🏫 Instructor Schedule</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/search" element={<CourseSearch />} />
            <Route path="/instructor" element={<InstructorSchedule />} />
            <Route path="/session-enrollment" element={<SessionEnrollment />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2025 Course Registration System. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home">
      <h2>Welcome to the Course Registration System</h2>
      <p>Use the navigation bar above to get started with registration, course search, or managing instructor schedules.</p>
    </div>
  );
}

export default App;