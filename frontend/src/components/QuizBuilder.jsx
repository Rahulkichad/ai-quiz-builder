import React, { useState, useEffect } from 'react';
import QuizSetupWizard from './QuizSetupWizard';
import './QuizBoard.css';

import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import confettiAnim from '../assets/rocket-lottie.json';

// Avatars for each user role
const avatars = {
  teacher: '🧑‍🏫',
  mentor: '🧑‍💼',
  student: '🧑‍🎓',
};

// Color themes for each user role
const themes = {
  teacher: { bg: '#f8fafc', accent: '#6366f1' },
  mentor: { bg: '#f8fafc', accent: '#6366f1' },
  student: { bg: '#f8fafc', accent: '#6366f1' },
};

// Real: fetch quiz data from FastAPI backend
export async function fetchQuiz({ prompt, role, difficulty, num_questions, explanations, useTimeout, timeoutDuration }) {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const res = await fetch(`${apiUrl}/api/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, role, difficulty, num_questions, explanations, useTimeout, timeoutDuration })
  });
  if (!res.ok) {
    throw new Error(`Failed to generate quiz: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

async function submitAnswers({ questions, user_answers }) {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const res = await fetch(`${apiUrl}/api/submit-answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questions, user_answers })
  });
  if (!res.ok) {
    throw new Error(`Failed to submit answers: ${res.status}`);
  }
  return await res.json();
} 

export function QuizBoard({ quiz, onRestart }) {
  const [useTimeout, setUseTimeout] = useState(quiz.useTimeout);
  const [timeoutDuration, setTimeoutDuration] = useState(quiz.timeoutDuration || 15);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState(quiz.questions.map(q => Array.isArray(q.answer) ? [] : null));
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const quizStarted = current > 0 || !!results;
  const [showToast, setShowToast] = useState(false);
  const [outOfTime, setOutOfTime] = useState(false);
  const timerRef = React.useRef();
  const [timer, setTimer] = useState(useTimeout ? timeoutDuration : null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [animating, setAnimating] = useState(false);
  const theme = themes[quiz.role] || themes.teacher;
  const avatar = avatars[quiz.role] || avatars.teacher;
  const q = quiz.questions[current];
  const encouragements = [
    "Let's go!",
    "Keep it up!",
    "You're doing great!",
    "Halfway there!",
    "Almost done!"
  ];
  const encouragement = encouragements[Math.floor((current/quiz.questions.length)*encouragements.length)] || '';

  // For confetti
  const getScorePct = () => results ? (results.correct / results.total) : 0;
  const showConfetti = results && getScorePct() >= 0.7;
  const motivational = results ? (
    getScorePct() === 1 ? "🏆 Perfect! You're a quiz master!" :
    getScorePct() >= 0.8 ? "🎉 Great job!" :
    getScorePct() >= 0.6 ? "👏 Good effort!" :
    "💡 Try again for a better score!"
  ) : null;

  useEffect(() => {
    if (!useTimeout || results) return;
    if (timer === 0) {
      setOutOfTime(true);
      // If an answer is selected, record and advance; else skip
      if ((Array.isArray(q.answer) && Array.isArray(selected) && selected.length > 0) || (!Array.isArray(q.answer) && selected !== null && selected !== undefined)) {
        recordAnswer(selected);
      } else {
        const skipped = Array.isArray(q.answer) ? [] : null;
        setSelected(skipped);
        recordAnswer(skipped);
      }
      if (current < quiz.questions.length - 1) {
        setCurrent(current + 1);
        setOutOfTime(false);
      } else {
        setLoading(true);
        setError(null);
        const sanitizedAnswers = quiz.questions.map((q, i) => {
          let ans = answers[i];
          if (typeof ans === "function" || (typeof ans === "object" && ans !== null && !Array.isArray(ans))) {
            ans = null;
          }
          if (Array.isArray(q.answer)) {
            if (!Array.isArray(ans)) return [];
            return ans.filter(val => typeof val === "number");
          } else {
            if (typeof ans === "number") return ans;
            return null;
          }
        });
        submitAnswersAndShowResults(sanitizedAnswers);
      }
      return;
    }
    setOutOfTime(false);
    const interval = setInterval(() => setTimer(t => t-1), 1000);
    return () => clearInterval(interval);
  }, [timer, results, useTimeout, selected, current, answers, q.answer]);

  useEffect(() => {
    setSelected(answers[current]);
    setOutOfTime(false);
  }, [current, answers]);

  useEffect(() => {
    if (useTimeout) {
      setTimer(timeoutDuration);
    } else {
      setTimer(null);
    }
    setFeedback(null);
    setAnimating(false);
    setOutOfTime(false);
  }, [current, useTimeout, timeoutDuration]);

  const handleTimeoutToggle = (e) => {
    setUseTimeout(e.target.checked);
  };
  const handleTimeoutDurationChange = (e) => {
    let val = Number(e.target.value);
    if (val < 5) val = 5;
    if (val > 120) val = 120;
    setTimeoutDuration(val);
  };

  const handleOption = (optIdx) => {
    const q = quiz.questions[current];
    let newValue;
    if (Array.isArray(q.answer)) {
      // Multi-answer: store indices
      newValue = Array.isArray(selected) ? (
        selected.includes(optIdx)
          ? selected.filter(v => v !== optIdx)
          : [...selected, optIdx]
      ) : [optIdx];
    } else {
      // Single-answer: store index
      newValue = optIdx;
    }
    setSelected(newValue);
  };

  const recordAnswer = (ans) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[current] = ans;
      return updated;
    });
  };

  const handleNext = () => {
    if ((Array.isArray(q.answer) && (!Array.isArray(selected) || selected.length === 0)) || (!Array.isArray(q.answer) && (selected === null || selected === undefined))) {
      // Do not advance if no answer selected
      return;
    }
    // Always record the latest selection for the last question before submit
    let finalAnswers = [...answers];
    finalAnswers[current] = selected;
    if (current < quiz.questions.length - 1) {
      recordAnswer(selected);
      setCurrent(current + 1);
    } else {
      setLoading(true);
      setError(null);
      // Sanitize answers before submitting
      const sanitizedAnswers = quiz.questions.map((q, i) => {
        let ans = finalAnswers[i];
        if (typeof ans === "function" || (typeof ans === "object" && ans !== null && !Array.isArray(ans))) {
          ans = null;
        }
        if (Array.isArray(q.answer)) {
          if (!Array.isArray(ans)) return [];
          return ans.filter(val => typeof val === "number");
        } else {
          if (typeof ans === "number") return ans;
          return null;
        }
      });
      submitAnswersAndShowResults(sanitizedAnswers);
    }
  };

  const handleSkip = () => {
    const q = quiz.questions[current];
    const skipped = Array.isArray(q.answer) ? [] : null;
    setSelected(skipped);
    recordAnswer(skipped);
    if (current < quiz.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setLoading(true);
      setError(null);
      const sanitizedAnswers = quiz.questions.map((q, i) => {
        let ans = answers[i];
        if (typeof ans === "function" || (typeof ans === "object" && ans !== null && !Array.isArray(ans))) {
          ans = null;
        }
        if (Array.isArray(q.answer)) {
          if (!Array.isArray(ans)) return [];
          return ans.filter(val => typeof val === "number");
        } else {
          if (typeof ans === "number") return ans;
          return null;
        }
      });
      submitAnswersAndShowResults(sanitizedAnswers);
    }
  };

  // Always sanitize answers before submit to match backend expectations
  const sanitizeAnswers = (answersArr) => quiz.questions.map((q, i) => {
    let ans = answersArr[i];
    if (typeof ans === "function" || (typeof ans === "object" && ans !== null && !Array.isArray(ans))) {
      ans = null;
    }
    if (Array.isArray(q.answer)) {
      if (!Array.isArray(ans)) return [];
      return ans.filter(val => typeof val === "number");
    } else {
      if (typeof ans === "number") return ans;
      return null;
    }
  });

  const submitAnswersAndShowResults = async (finalAnswers = answers) => {
    try {
      // Sanitize again here in case this is called directly (e.g. on skip)
      const sanitized = sanitizeAnswers(finalAnswers);
      console.log('Submitting answers:', { questions: quiz.questions, user_answers: sanitized });
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const payload = { questions: quiz.questions, user_answers: sanitized };
      const resp = await fetch(`${apiUrl}/api/submit-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) {
        let errMsg = `Failed to submit answers: ${resp.status}`;
        try {
          const errJson = await resp.json();
          if (errJson && errJson.detail) {
            errMsg += '\n' + JSON.stringify(errJson.detail, null, 2);
          } else {
        }
      } catch (e) {
        // ignore
      }
      setError(errMsg); // Show backend error in UI
      setShowToast(true);
    } else {
      const res = await resp.json();
      console.log('Quiz results:', res);
      setResults(res);
    }
  } catch (err) {
    setError(err.message || 'Failed to submit answers.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div className="quiz-board"
    style={{ background: '#fff', minHeight: '500px', borderRadius: '8px', padding: '2rem', margin: '2rem auto', maxWidth: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
    initial={{opacity:0, y:30}}
    animate={{opacity:1, y:0}}
    exit={{opacity:0, y:30}}
    transition={{duration:0.7}}
  >
    {loading ? (
      <div className="spinner-container"><div className="spinner"></div><div style={{marginTop:'1rem'}}>Scoring quiz...</div></div>
    ) : error && showToast ? (
      <div className="toast-error">{error}</div>
    ) : !results ? (
      <>
        {/* Timer controls only before quiz starts */}
        {!quizStarted && (
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
            <div>
              <label style={{display:'flex',alignItems:'center',gap:6}}>
                <input type="checkbox" checked={useTimeout} onChange={handleTimeoutToggle} />
                Timeout per question
              </label>
              {useTimeout && (
                <label style={{display:'flex',alignItems:'center',gap:6}}>
                  Duration:
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={timeoutDuration}
                    onChange={handleTimeoutDurationChange}
                    style={{width:60}}
                  />
                  sec
                </label>
              )}
            </div>
          </div>
        )}
        {useTimeout && !results && (
            <div style={{textAlign:'center',fontWeight:'bold',color:'#e74c3c',marginBottom:'0.5rem',fontSize:'1.15rem'}}>
              Time left: {timer}s
            </div>
          )}
        <div className="quiz-avatar" style={{ fontSize: '2.1rem', margin: '0 auto 0.5rem auto', textAlign: 'center' }}>{avatar}</div>
        {quiz && quiz.questions && quiz.questions[current] && (
          <div style={{ fontWeight: 600, color: '#6366f1', fontSize: '1.08rem', textAlign: 'center', marginBottom: '0.5rem', letterSpacing: '0.01em' }}>
            Question {current + 1} of {quiz.questions.length}
          </div>
        )}
        {quiz && quiz.questions && quiz.questions[current] && (
          <div style={{ fontWeight: 700, color: '#3730a3', fontSize: '1.1rem', textAlign: 'center', marginBottom: '1rem', lineHeight: 1.3 }}>
            {quiz.questions[current].text}
          </div>
        )}
        <div className="quiz-options" style={{ marginBottom: '1.2rem' }}>
          {quiz && quiz.questions && quiz.questions[current] && (
            quiz.questions[current].options.map((opt, i) => (
              <label key={i} className={`quiz-option${Array.isArray(selected) && selected.includes(i) ? ' selected' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: outOfTime ? 'not-allowed' : 'pointer', opacity: outOfTime ? 0.6 : 1, padding: '0.5rem', borderRadius: '8px', backgroundColor: Array.isArray(selected) && selected.includes(i) ? '#e5e7eb' : '#fff', border: Array.isArray(selected) && selected.includes(i) ? '1px solid #6366f1' : '1px solid #ddd', transition: 'all 0.3s ease-in-out' }}
                onMouseOver={e => { if (!outOfTime) e.currentTarget.style.backgroundColor = '#f7f7f7'; }}
                onMouseOut={e => { if (!outOfTime) e.currentTarget.style.backgroundColor = Array.isArray(selected) && selected.includes(i) ? '#e5e7eb' : '#fff'; }}
              >
                {Array.isArray(quiz.questions[current].answer) ? (
                  <input
                    type="checkbox"
                    checked={Array.isArray(selected) && selected.includes(i)}
                    disabled={outOfTime}
                    onChange={() => !outOfTime && handleOption(i)}
                  />
                ) : (
                  <input
                    type="radio"
                    checked={selected === i}
                    disabled={outOfTime}
                    onChange={() => !outOfTime && handleOption(i)}
                  />
                )}
                {opt}
              </label>
            ))
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button
            type="button"
            className="quiz-btn quiz-skip"
            onClick={handleSkip}
            style={{ minWidth: 90, height: 42, padding: '0.5rem 1.5rem', borderRadius: 16, fontWeight: 'bold', background: '#f3f4f6', color: '#6366f1', border: '2px solid #6366f1', fontSize: '1.07rem', cursor: 'pointer', transition: 'background 0.2s, color 0.2s, border 0.2s' }}
          >
            Skip
          </button>
          {/* Show Previous button only if timer is OFF */}
          {!useTimeout && (
            <button
              type="button"
              className="quiz-btn quiz-prev"
              onClick={() => setCurrent(current - 1)}
              disabled={current === 0}
              style={{ minWidth: 90, height: 42, padding: '0.5rem 1.5rem', borderRadius: 16, fontWeight: 'bold', background: current === 0 ? '#f3f4f6' : '#e0e7ff', color: current === 0 ? '#b5b5b5' : '#3730a3', border: '2px solid #6366f1', fontSize: '1.07rem', cursor: current === 0 ? 'not-allowed' : 'pointer', opacity: current === 0 ? 0.7 : 1, transition: 'background 0.2s, color 0.2s, border 0.2s' }}
            >
              Previous
            </button>
          )}
          <button
            type="button"
            className="quiz-btn quiz-next"
            onClick={handleNext}
            style={{ minWidth: 90, height: 42, padding: '0.5rem 1.5rem', borderRadius: 16, fontWeight: 'bold', background: '#6366f1', color: '#fff', border: '2px solid #6366f1', fontSize: '1.07rem', cursor: 'pointer', marginLeft: 'auto', transition: 'background 0.2s, color 0.2s, border 0.2s' }}
            disabled={(Array.isArray(q.answer) && (!Array.isArray(selected) || selected.length === 0)) || (!Array.isArray(q.answer) && (selected === null || selected === undefined))}
          >
            {current < quiz.questions.length - 1 ? 'Next' : 'Submit'}
          </button>
        </div>
      </>
    ) : (
      <div>
        <h2 style={{textAlign:'center',marginBottom:'1rem'}}>Quiz Results</h2>
        {results && (
          <div style={{textAlign:'center',fontWeight:'bold',fontSize:'1.15rem',marginBottom:'1rem',color:'#6366f1'}}>
            Score: {results.correct} / {results.total}
          </div>
        )}
        <ol style={{paddingLeft:18}}>
          {results && results.results && results.results.map((r,i) => {
            const userAns = r.user_answer;
            const correctAns = r.correct_answer;
            const isSkipped = Array.isArray(userAns) ? userAns.length === 0 : userAns === null || userAns === undefined;
            let isCorrect = false;
            if (Array.isArray(correctAns)) {
              isCorrect = Array.isArray(userAns) && userAns.length === correctAns.length && userAns.every((v, idx) => v === correctAns[idx]);
            } else {
              isCorrect = userAns === correctAns;
            }
            return (
              <li key={i} style={{marginBottom:'1rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontSize:'1.1rem',fontWeight:600,color:'#6366f1',letterSpacing:0.5}}>Q{i+1}</div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    {isSkipped ? (
                      <div style={{color:'#666'}}>Skipped</div>
                    ) : isCorrect ? (
                      <div style={{color:'#2ecc71'}}>
                        {window?.FontAwesomeConfig ? <i className="fas fa-check"></i> : '✔️'} Correct
                      </div>
                    ) : (
                      <div style={{color:'#e74c3c'}}>
                        {window?.FontAwesomeConfig ? <i className="fas fa-times"></i> : '❌'} Incorrect
                      </div>
                    )}
                  </div>
                </div>
                <div style={{fontSize:'1.05rem',color:'#3730a3',marginBottom:'0.3rem',fontWeight:600}}>
                  Q{i+1}: {r.question}
                </div>
                <div style={{fontSize:'1rem',color:'#666'}}>
                  {(() => {
                    const options = quiz.questions[i]?.options || [];
                    return (
                      <>
                        Your answer: {Array.isArray(userAns)
                          ? (userAns.length > 0
                            ? userAns.map(idx => {
                                const text = typeof idx === 'number' && options[idx] !== undefined ? `[${idx}] - ${options[idx]}` : `[${idx}] - —`;
                                return text;
                              }).join(', ')
                            : '—')
                          : (userAns !== null && userAns !== undefined
                            ? `[${userAns}] - ${(typeof userAns === 'number' && options[userAns] !== undefined) ? options[userAns] : '—'}`
                            : '—')}
                        <br />
                        Correct answer: {Array.isArray(correctAns)
                          ? (correctAns.length > 0
                            ? correctAns.map(idx => {
                                const text = typeof idx === 'number' && options[idx] !== undefined ? `[${idx}] - ${options[idx]}` : `[${idx}] - —`;
                                return text;
                              }).join(', ')
                            : '—')
                          : (correctAns !== null && correctAns !== undefined
                            ? `[${correctAns}] - ${(typeof correctAns === 'number' && options[correctAns] !== undefined) ? options[correctAns] : '—'}`
                            : '—')}
                      </>
                    );
                  })()}
                </div>
                {r.explanation && (
                  <div style={{fontSize:'0.95rem',color:'#888',marginTop:'0.5rem'}}>
                    <b>Explanation:</b> {r.explanation}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        <div style={{textAlign:'center',marginTop:'2rem'}}>
          <button className="quiz-restart" onClick={onRestart} style={{padding:'0.7rem 2.5rem',fontWeight:'bold',background:'#6366f1',color:'#fff',border:'none',borderRadius:12,fontSize:'1.1rem'}}>Restart Quiz</button>
        </div>
        {showConfetti && (
          <Lottie animationData={confettiAnim} loop={false} style={{width:280,margin:'2rem auto'}} />
        )}
        <div style={{textAlign:'center',marginTop:'1.5rem',fontSize:'1.2rem',fontWeight:600}}>{motivational}</div>
      </div>
    )}
  </motion.div>
  );
}

// ErrorBoundary for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', background: '#fff0f0', borderRadius: '8px' }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function QuizBuilder() {
  const [quiz, setQuiz] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleGenerate = async params => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuiz(params);
      setQuiz({ ...data, useTimeout: params.useTimeout, timeoutDuration: params.timeoutDuration });
    } catch (err) {
      setError(err.message || 'Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => setQuiz(null);

  if (loading) return <div style={{textAlign:'center',marginTop:'2rem'}}>Generating quiz...</div>;
  if (error) return <div style={{color:'red',textAlign:'center',marginTop:'2rem'}}>{error}</div>;

  return quiz ? (
    <ErrorBoundary>
      <QuizBoard quiz={quiz} onRestart={handleRestart} />
    </ErrorBoundary>
  ) : (
    <QuizSetupWizard onGenerate={handleGenerate} />
  );
}
export default QuizBuilder;