import React, { useState } from 'react';

function CourseSearch() {
  const [searchBy, setSearchBy] = useState("department");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    setLoading(true);

    const queryParam = encodeURIComponent(searchTerm);
    const url = `http://ec2-54-175-116-227.compute-1.amazonaws.com:5001/api/courses?${searchBy}=${queryParam}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch courses");
        return res.json();
      })
      .then(data => {
        setResults(data);
      })
      .catch(err => {
        console.error("Course search error:", err);
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Search Courses</h2>

      <label>Search by:</label>
      <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
        <option value="department">Department</option>
        <option value="course_number">Course Number</option>
        <option value="course_name">Course Name</option>
      </select>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter search term"
      />

      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading results...</p>}

      <ul>
        {results.length === 0 && !loading && <li>No results found.</li>}
        {results.map((course, index) => (
          <li key={index}>
            {course.department} {course.course_number} – {course.course_name} ({course.credit_hours} credits, {course.modality})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseSearch;
