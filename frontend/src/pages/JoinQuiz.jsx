import React, { useState } from 'react';
import axios from 'axios';
import './Collaborative.css';

export default function JoinQuiz() {
  const [inviteCode, setInviteCode] = useState('');
  const [joined, setJoined] = useState(false);
  const [quizId, setQuizId] = useState('');
  const [error, setError] = useState('');
  // TODO: Replace with real user info from auth
  const userId = 'demo-user-id';

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/quiz/join', { userId, inviteCode });
      setJoined(true);
      setQuizId(res.data.quizId);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not join quiz');
    }
  };

  return (
    <div className="collaborative-page">
      <div className="collab-card">
        <h2>Join a Collaborative Quiz</h2>
        <form onSubmit={handleJoin}>
          <label>Invite Code:<br/>
            <input value={inviteCode} onChange={e => setInviteCode(e.target.value.toUpperCase())} required />
          </label><br/>
          <button type="submit" className="collab-btn">Join</button>
        </form>
        {joined && <div>
          <h3>Joined Quiz!</h3>
          <p>Quiz ID: <b>{quizId}</b></p>
          <a href={`/quiz/${quizId}`}>Go to Quiz</a>
        </div>}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
