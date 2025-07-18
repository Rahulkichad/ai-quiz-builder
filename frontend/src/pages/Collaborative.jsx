import React from 'react';
import { Link } from 'react-router-dom';
import './Collaborative.css';

export default function Collaborative() {
  return (
    <div className="collaborative-page">
      <h2>Collaborative Quiz Hub</h2>
      <p>Create or join quizzes as a student, mentor, or teacher. Compete with friends and view live leaderboards!</p>
      <div className="collab-actions">
        <Link to="/collab-create" className="collab-btn">Create Collaborative Quiz</Link>
        <Link to="/collab-join" className="collab-btn">Join Collaborative Quiz</Link>
      </div>
    </div>
  );
}
