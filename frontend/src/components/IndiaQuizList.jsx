import React, { useState } from 'react';
import './IndiaQuizList.css';
import { fetchQuiz, QuizBoard } from './QuizBuilder';

const indiaQuizzes = [
  {
    id: 1,
    title: 'Indian History',
    description: 'Test your knowledge of ancient to modern Indian history!',
    emoji: '📜',
    prompt: 'Generate a comprehensive quiz about Indian history covering ancient, medieval, and modern periods',
    role: 'teacher',
    difficulty: 'medium',
    num_questions: 20
  },
  {
    id: 2,
    title: 'Indian Geography',
    description: 'How well do you know the mountains, rivers, and states of India?',
    emoji: '🗺️',
    questions: [/* ... */],
  },
  {
    id: 3,
    title: 'Festivals of India',
    description: 'Identify these vibrant festivals celebrated across India.',
    emoji: '🎉',
    questions: [/* ... */],
  },
  {
    id: 4,
    title: 'Indian Monuments',
    description: 'Can you recognize these iconic Indian landmarks?',
    emoji: '🏛️',
    questions: [/* ... */],
  },
  {
    id: 5,
    title: 'Famous Indian Personalities',
    description: 'Match these personalities to their achievements.',
    emoji: '🧑‍🎤',
    questions: [/* ... */],
  },
  {
    id: 6,
    title: 'Indian Cuisine',
    description: 'Guess the dish from the picture or description!',
    emoji: '🍛',
    questions: [/* ... */],
  },
  {
    id: 7,
    title: 'Indian Languages',
    description: 'How many official languages can you identify?',
    emoji: '🗣️',
    questions: [/* ... */],
  },
    {
    id: 8,
    title: 'Hinduism & Mythology',
    description: 'Explore the deities, epics, and sacred texts of Hindu tradition.',
    emoji: '🕉️',
    questions: [/* ... */],
  },
  {
    id: 9,
    title: 'Buddhism & Jainism',
    description: 'Test your knowledge about Buddhist and Jain teachings, symbols, and history.',
    emoji: '☸️',
    questions: [/* ... */],
  },
  {
    id: 10,
    title: 'Sikh Heritage',
    description: 'How well do you know Sikh Gurus, Gurdwaras, and traditions?',
    emoji: '🪯',
    questions: [/* ... */],
  },
  {
    id: 11,
    title: 'Indian Spiritual Heritage',
    description: 'Discover the diverse spiritual and architectural heritage of India.',
    emoji: '🛕',
    questions: [/* ... */],
  },
  {
    id: 12,
    title: 'Educational Heritage of India',
    description: 'Learn about ancient universities, scholars, and India’s contributions to education.',
    emoji: '🏫',
    questions: [/* ... */],
  },
  {
    id: 13,
    title: 'Medical Heritage of India',
    description: 'Explore Ayurveda, Yoga, and India’s traditional healing systems.',
    emoji: '🧑‍⚕️',
    questions: [/* ... */],
  },
  // ...add more India-centric quizzes here...
];

const IndiaQuizList = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuizSelect = async (quiz) => {
    setSelectedQuiz(quiz);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuiz({
        prompt: quiz.prompt,
        role: quiz.role,
        difficulty: quiz.difficulty,
        num_questions: quiz.num_questions,
        explanations: true
      });
      setQuiz({ ...data, topic: quiz });
    } catch (err) {
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setQuiz(null);
    setSelectedQuiz(null);
    setError(null);
  };

  if (loading) return <div style={{textAlign:'center',marginTop:'2rem'}}>Generating quiz...</div>;
  if (error) return <div style={{color:'red',textAlign:'center',marginTop:'2rem'}}>{error}</div>;

  if (quiz && selectedQuiz) {
    return (
      <div style={{maxWidth: 700, margin: '0 auto'}}>
        <button onClick={handleRestart} style={{marginBottom: 16, background: 'none', border: 'none', color: '#007bff', cursor: 'pointer'}}>← Back to topics</button>
        <QuizBoard quiz={quiz} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div className="india-quiz-grid">
      {indiaQuizzes.map(quiz => (
        <div key={quiz.id} className="india-quiz-card" onClick={() => handleQuizSelect(quiz)}>
          <div className="india-quiz-emoji">{quiz.emoji}</div>
          <h3 className="india-quiz-title">{quiz.title}</h3>
          <p className="india-quiz-desc">{quiz.description}</p>
        </div>
      ))}
    </div>
  );
};

export default IndiaQuizList;
