import React, { useState } from 'react';
import axios from 'axios';
import './Collaborative.css';

const QuizModes = {
  NONE: '',
  MANUAL: 'manual',
  AI: 'ai',
};

const roles = ['student', 'mentor', 'teacher'];

export default function CreateQuiz() {
  const [quizMode, setQuizMode] = useState(QuizModes.NONE);
  const [title, setTitle] = useState('');
  const [role, setRole] = useState(roles[0]);
  const [maxParticipants, setMaxParticipants] = useState(5);
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], answer: 0 }
  ]);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // AI quiz creation state
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('medium');

  // TODO: Replace with real user info from auth
  const userId = 'demo-user-id';

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], answer: 0 }]);
  };

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    if (field === 'text' || field === 'answer') updated[idx][field] = value;
    else updated[idx].options[field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/quiz/create', {
        userId,
        role,
        title,
        questions,
        maxParticipants
      });
      setInviteCode(res.data.inviteCode);
      setQuizId(res.data.quizId);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating quiz');
    }
    setLoading(false);
  };

  return (
    <div className="collaborative-page">
      <div style={{display:'flex',justifyContent:'center',gap:'2rem',marginBottom:'2.5rem'}}>
        <div className={`collab-card${quizMode===QuizModes.MANUAL?' selected':''}`} style={{cursor:'pointer',maxWidth:260,boxShadow:quizMode===QuizModes.MANUAL?'0 6px 32px #4f8cff33':'',border:quizMode===QuizModes.MANUAL?'2px solid #4f8cff':'1.5px solid #dbe5f7'}} onClick={()=>setQuizMode(QuizModes.MANUAL)}>
          <h3 style={{textAlign:'center',fontSize:'1.18rem',marginBottom:'0.7rem'}}>📝 Build Quiz Manually</h3>
          <p style={{color:'#444',fontSize:'1rem',textAlign:'center'}}>Enter your own questions and options step-by-step.</p>
        </div>
        <div className={`collab-card${quizMode===QuizModes.AI?' selected':''}`} style={{cursor:'pointer',maxWidth:260,boxShadow:quizMode===QuizModes.AI?'0 6px 32px #7f53ff33':'',border:quizMode===QuizModes.AI?'2px solid #7f53ff':'1.5px solid #dbe5f7'}} onClick={()=>setQuizMode(QuizModes.AI)}>
          <h3 style={{textAlign:'center',fontSize:'1.18rem',marginBottom:'0.7rem'}}>🤖 Generate with AI</h3>
          <p style={{color:'#444',fontSize:'1rem',textAlign:'center'}}>Let AI create a quiz for you based on a topic and role.</p>
        </div>
      </div>
      {quizMode === QuizModes.NONE && (
        <div style={{textAlign:'center',color:'#888',fontSize:'1.1rem',marginBottom:'2rem'}}>Choose how you want to create your quiz.</div>
      )}
      {quizMode === QuizModes.MANUAL && (
        <div className="collab-card">
          <h2>Create a Collaborative Quiz</h2>
          <form onSubmit={handleSubmit}>
            <label>Quiz Title:<br/>
              <input value={title} onChange={e => setTitle(e.target.value)} required />
            </label><br/>
            <label>Role:<br/>
              <select value={role} onChange={e => setRole(e.target.value)}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label><br/>
            <label>Max Participants:<br/>
              <input type="number" min={2} max={100} value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} />
            </label><br/>
            <h4>Questions:</h4>
            {questions.map((q, idx) => (
              <div key={idx} className="question-block">
                <input placeholder="Question text" value={q.text} onChange={e => handleQuestionChange(idx, 'text', e.target.value)} required />
                <div>
                  {q.options.map((opt, oidx) => (
                    <input key={oidx} placeholder={`Option ${oidx+1}`} value={opt} onChange={e => handleQuestionChange(idx, oidx, e.target.value)} required />
                  ))}
                </div>
                <label>Correct Option (0-3):
                  <input type="number" min={0} max={3} value={q.answer} onChange={e => handleQuestionChange(idx, 'answer', e.target.value)} required />
                </label>
              </div>
            ))}
            <button type="button" className="collab-btn" onClick={addQuestion}>Add Question</button><br/>
            <button type="submit" className="collab-btn" disabled={loading}>{loading ? 'Creating...' : 'Create Quiz'}</button>
          </form>
          {inviteCode && <div>
            <h3>Quiz Created!</h3>
            <p>Invite Code: <b>{inviteCode}</b></p>
            <p>Share this code with others to join your quiz.</p>
          </div>}
          {error && <div className="error">{error}</div>}
        </div>
      )}
      {quizMode === QuizModes.AI && (
        <div className="collab-card" style={{maxWidth:520,margin:'2rem auto'}}>
          <h2>Generate Quiz with AI</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError('');
            try {
              const res = await axios.post('/api/quiz/create-ai', {
                title, role, topic: aiTopic, difficulty: aiDifficulty, maxParticipants
              });
              setInviteCode(res.data.inviteCode);
              setQuestions(res.data.questions || []);
            } catch (err) {
              setError(err.response?.data?.error || 'Failed to generate quiz');
            }
            setLoading(false);
          }}>
            <label>Quiz Title:<br/>
              <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Indian History" />
            </label><br/>
            <label>Role:<br/>
              <select value={role} onChange={e => setRole(e.target.value)}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label><br/>
            <label>Topic:<br/>
              <input value={aiTopic} onChange={e => setAiTopic(e.target.value)} required placeholder="e.g. Freedom Fighters" />
            </label><br/>
            <label>Difficulty:<br/>
              <select value={aiDifficulty} onChange={e => setAiDifficulty(e.target.value)}>
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
          {questions && questions.length > 0 && <div style={{marginTop:'1.2rem'}}>
            <h4>Sample Questions:</h4>
            <ul style={{textAlign:'left'}}>
              {questions.map((q,i) => <li key={i}><b>{q.text}</b></li>)}
            </ul>
          </div>}
          {error && <div className="error" style={{marginTop:'1rem'}}>{error}</div>}
        </div>
      )}
    </div>
  );
}
