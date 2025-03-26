import React, { useState } from 'react';

const studentData = {
  "Intro to Programming": [
    { name: "Alice Johnson", id: "S001" },
    { name: "Bob Smith", id: "S002" }
  ],
  "Data Structures": [
    { name: "Charlie Brown", id: "S003" },
    { name: "David Wilson", id: "S004" }
  ]
};

function SessionEnrollment() {
  const [selectedCourse, setSelectedCourse] = useState("");

  return (
    <div>
      <h2>Session Enrollment</h2>
      <label>Select a Course:</label>
      <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
        <option value="">--Select--</option>
        {Object.keys(studentData).map(course => (
          <option key={course} value={course}>{course}</option>
        ))}
      </select>

      {selectedCourse && (
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
            </tr>
          </thead>
          <tbody>
            {studentData[selectedCourse].map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SessionEnrollment;