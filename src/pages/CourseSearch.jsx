import React, { useState } from 'react';

const dummyCourses = [
  { department: "CS", courseNumber: "101", instructor: "Dr. Smith" },
  { department: "MATH", courseNumber: "201", instructor: "Dr. Johnson" },
  { department: "BIO", courseNumber: "101", instructor: "Dr. Lee" },
];

function CourseSearch() {
  const [searchBy, setSearchBy] = useState("department");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const filtered = dummyCourses.filter(course =>
      course[searchBy].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div>
      <h2>Search Courses</h2>
      <label>Search by:</label>
      <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
        <option value="department">Department</option>
        <option value="instructor">Instructor</option>
        <option value="courseNumber">Course Number</option>
      </select>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter search term"
      />

      <button onClick={handleSearch}>Search</button>

      <ul>
        {results.map((course, index) => (
          <li key={index}>
            {course.department} {course.courseNumber} - {course.instructor}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseSearch;
