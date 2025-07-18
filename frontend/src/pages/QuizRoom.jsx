import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function QuizRoom() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  // TODO: Replace with real user info from auth
  const userId = 'demo-user-id';

  useEffect(() => {
    if (quizId) {
      axios.get(`/api/quiz/${quizId}/results`).then(res => {
        setQuiz(res.data.responses.length ? res.data.responses[0].quiz : null); // fallback
      }).catch(() => {});
      axios.get(`/api/quiz/${quizId}/leaderboard`).then(res => setLeaderboard(res.data.leaderboard || [])).catch(() => {});
    }
  }, [quizId]);

  const handleAnswer = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/quiz/submit', { userId, quizId, answers });
      setScore(res.data.score);
      setSubmitted(true);
      // Refresh leaderboard
      const lb = await axios.get(`/api/quiz/${quizId}/leaderboard`);
      setLeaderboard(lb.data.leaderboard || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting answers');
    }
  };

  if (!quiz) return <div>Loading quiz...</div>;

  return (
    <div className="quiz-room-page">
      <h2>{quiz.title}</h2>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="question-block">
            <div>{q.text}</div>
            {q.options.map((opt, oidx) => (
              <label key={oidx}>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value={oidx}
                  checked={answers[idx] === oidx}
                  onChange={() => handleAnswer(idx, oidx)}
                  disabled={submitted}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        {!submitted && <button type="submit">Submit Answers</button>}
      </form>
      {score !== null && <div>Your Score: <b>{score}</b></div>}
      <h3>Leaderboard</h3>
      <ul>
        {leaderboard.map((entry, idx) => (
          <li key={idx}>{entry.userId?.name || entry.userId}: {entry.score}</li>
        ))}
      </ul>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
