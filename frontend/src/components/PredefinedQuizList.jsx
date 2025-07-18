import React, { useState } from 'react';
import './PredefinedQuizList.css';
import quizTopics from './quizTopics';
import QuizBuilder, { fetchQuiz, QuizBoard } from './QuizBuilder';

function PredefinedQuizList() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When a topic is selected, fetch/generate a quiz for that topic
  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic);
    setLoading(true);
    setError(null);
    setQuiz(null);
    try {
      const data = await fetchQuiz({ prompt: topic.title, role: topic.role, difficulty: topic.difficulty, num_questions: topic.num_questions || 15, explanations: true });
      setQuiz({ ...data, topic });
    } catch (err) {
      setError(err.message || 'Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setQuiz(null);
    setSelectedTopic(null);
    setError(null);
  };

  if (loading) return <div style={{textAlign:'center',marginTop:'2rem'}}>Generating quiz...</div>;
  if (error) return <div style={{color:'red',textAlign:'center',marginTop:'2rem'}}>{error}</div>;

  if (quiz && selectedTopic) {
    return (
      <div style={{maxWidth: 700, margin: '0 auto'}}>
        <button onClick={handleRestart} style={{marginBottom: 16, background: 'none', border: 'none', color: '#007bff', cursor: 'pointer'}}>← Back to topics</button>
        <QuizBoard quiz={quiz} onRestart={handleRestart} />
      </div>
    );
  }

  // Topic grid
  return (
    <div className="predefined-quiz-grid">
      {quizTopics.map(topic => (
        <div key={topic.key} className="predefined-quiz-card" onClick={() => handleTopicSelect(topic)}>
          <div className="predefined-quiz-emoji">{topic.emoji}</div>
          <div className="predefined-quiz-title">{topic.title}</div>
        </div>
      ))}
    </div>
  );
}

export default PredefinedQuizList;
