import React, { useState } from 'react';
import axios from 'axios';
import './Collaborative.css';

const roles = ['student', 'mentor', 'teacher'];

export default function CollaborativeCreateAI() {
  const [title, setTitle] = useState('');
  const [role, setRole] = useState(roles[0]);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [maxParticipants, setMaxParticipants] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [questions, setQuestions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('Sending request to /api/quiz/create-ai with:', {
        title, role, topic, difficulty, maxParticipants
      });
      
      const res = await axios.post('/api/quiz/create-ai', {
        title, 
        role, 
        topic, 
        difficulty, 
        maxParticipants: Number(maxParticipants)
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Response from server:', res.data);
      
      if (res.data.inviteCode) {
        setInviteCode(res.data.inviteCode);
        setQuestions(res.data.questions || []);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error creating quiz:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.error || err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="collaborative-page">
      <div className="collab-card" style={{maxWidth:520,margin:'2rem auto'}}>
        <h2>Generate Collaborative Quiz with AI</h2>
        <form onSubmit={handleSubmit}>
          <label>Quiz Title:<br/>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Indian History" />
          </label><br/>
          <label>Role:<br/>
            <select value={role} onChange={e => setRole(e.target.value)}>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label><br/>
          <label>Topic:<br/>
            <input value={topic} onChange={e => setTopic(e.target.value)} required placeholder="e.g. Freedom Fighters" />
          </label><br/>
          <label>Difficulty:<br/>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label><br/>
          <label>Max Participants:<br/>
            <input type="number" min={2} max={100} value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} />
          </label><br/>
          <button type="submit" className="collab-btn" disabled={loading} style={{fontWeight:700,minWidth:120,position:'relative'}}>
            {loading ? <span className="spinner" aria-label="Loading" style={{display:'inline-block',width:18,height:18,border:'3px solid #7f53ff',borderTop:'3px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite',verticalAlign:'middle',marginRight:7}}></span> : null}
            {loading ? 'Generating...' : 'Generate Quiz with AI'}
          </button>
        </form>
        {inviteCode && <div style={{marginTop:'1.2rem',textAlign:'center'}}>
          <h3>Quiz Created!</h3>
          <p>Invite Code: <b>{inviteCode}</b></p>
          <p>Share this code with others to join your quiz.</p>
        </div>}
        {questions.length > 0 && <div style={{marginTop:'1.2rem'}}>
          <h4>Sample Questions:</h4>
          <ul style={{textAlign:'left'}}>
            {questions.map((q,i) => <li key={i}><b>{q.text}</b></li>)}
          </ul>
        </div>}
        {error && <div className="error" style={{marginTop:'1rem'}}>{error}</div>}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
