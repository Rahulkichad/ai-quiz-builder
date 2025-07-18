import React from 'react';
import PredefinedQuizList from '../components/PredefinedQuizList';

const PredefinedQuizzes = () => (
  <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Explore Predefined Quizzes</h1>
    <PredefinedQuizList />
  </div>
);

export default PredefinedQuizzes;
