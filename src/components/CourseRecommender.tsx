import React, { useState } from 'react';
import { getCoursesByField } from '../utils/courseData';

interface CourseRecommenderProps {
  field: string;
}

export const CourseRecommender: React.FC<CourseRecommenderProps> = ({ field }) => {
  const [numRecommendations, setNumRecommendations] = useState<number>(4);
  const courses = getCoursesByField(field);
  
  return (
    <div className="course-recommender">
      <h2>Courses & Certificates Recommendations</h2>
      
      <div className="slider-container">
        <label>Choose Number of Course Recommendations:</label>
        <input
          type="range"
          min="1"
          max="10"
          value={numRecommendations}
          onChange={(e) => setNumRecommendations(parseInt(e.target.value))}
          className="slider"
        />
        <span>{numRecommendations}</span>
      </div>
      
      <div className="courses-list">
        {courses.slice(0, numRecommendations).map((course, index) => (
          <div key={index} className="course-item">
            <span>{index + 1}. </span>
            <a href={course.link} target="_blank" rel="noopener noreferrer">
              {course.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};