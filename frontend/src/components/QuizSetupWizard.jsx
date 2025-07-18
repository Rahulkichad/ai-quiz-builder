import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChalkboardTeacher, FaUserGraduate, FaUserTie, FaCheckCircle, FaArrowRight, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';

const roles = [
  { label: 'Teacher', value: 'teacher', icon: <FaChalkboardTeacher color="#6366f1" size={24} /> },
  { label: 'Mentor', value: 'mentor', icon: <FaUserTie color="#22c55e" size={24} /> },
  { label: 'Student', value: 'student', icon: <FaUserGraduate color="#f59e42" size={24} /> },
];
const difficulties = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
];

const steps = [
  'Topic',
  'Role & Difficulty',
  'Number & Explanations',
  'Timeout',
  'Preview'
];

export default function QuizSetupWizard({ onGenerate }) {
  const [step, setStep] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [role, setRole] = useState('teacher');
  const [difficulty, setDifficulty] = useState('easy');
  const [numQuestions, setNumQuestions] = useState(3);
  const [explanations, setExplanations] = useState(false);
  const [useTimeout, setUseTimeout] = useState(false);
  const [timeoutDuration, setTimeoutDuration] = useState(15);

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const handleSubmit = e => {
    e.preventDefault();
    onGenerate({ prompt, role, difficulty, num_questions: numQuestions, explanations, useTimeout, timeoutDuration: useTimeout ? timeoutDuration : null });
  };

  return (
    <form onSubmit={handleSubmit} className="quiz-setup-wizard" style={{
      maxWidth: 540,
      margin: '2.5rem auto',
      padding: '2.5rem 2rem',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 60%, #fef9c3 100%)',
      borderRadius: 24,
      boxShadow: '0 8px 32px rgba(99,102,241,0.10)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{fontWeight:800,fontSize:'2rem',color:'#23254c',marginBottom:'1.7rem',textAlign:'center'}}>Create <span style={{color:'var(--primary)'}}>AI Quiz</span></h2>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:24}}>
        {steps.map((s, i) => (
          <span key={s} style={{
            background: i === step ? 'var(--primary)' : '#e0e7ff',
            color: i === step ? '#fff' : '#6366f1',
            borderRadius: '50%',
            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15,
            boxShadow: i === step ? '0 2px 8px #c7d2fe' : 'none'
          }}>{i < step ? <FaCheckCircle color="#22c55e" /> : i + 1}</span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="topic" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30}} transition={{duration:0.5}}>
            <label style={{fontWeight:700,fontSize:'1.1rem'}}>Quiz Topic <FaInfoCircle title="What is the quiz about?" style={{marginLeft:6}}/></label>
            <input type="text" value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="e.g. Python Basics" required style={{width:'100%',marginTop:8,marginBottom:24}} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="role-difficulty" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30}} transition={{duration:0.5}}>
            <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
              <div style={{flex:'1 1 180px'}}>
                <label style={{fontWeight:700,fontSize:'1.1rem'}}>Role</label>
                <div style={{display:'flex',gap:12,margin:'12px 0'}}>
                  {roles.map(r => (
                    <button key={r.value} type="button" onClick={()=>setRole(r.value)} style={{background:role===r.value?'var(--primary)':'#f1f5f9',color:role===r.value?'#fff':'#6366f1',border:'none',borderRadius:12,padding:'0.8rem 1rem',fontWeight:600,fontSize:'1.05rem',display:'flex',alignItems:'center',gap:8,boxShadow:role===r.value?'0 2px 8px #dbeafe':'none'}}>{r.icon} {r.label}</button>
                  ))}
                </div>
              </div>
              <div style={{flex:'1 1 180px'}}>
                <label style={{fontWeight:700,fontSize:'1.1rem'}}>Difficulty</label>
                <div style={{display:'flex',gap:12,margin:'12px 0'}}>
                  {difficulties.map(d => (
                    <button key={d.value} type="button" onClick={()=>setDifficulty(d.value)} style={{background:difficulty===d.value?'var(--primary)':'#f1f5f9',color:difficulty===d.value?'#fff':'#6366f1',border:'none',borderRadius:12,padding:'0.8rem 1rem',fontWeight:600,fontSize:'1.05rem',boxShadow:difficulty===d.value?'0 2px 8px #dbeafe':'none'}}>{d.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="number-explanations" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30}} transition={{duration:0.5}}>
            <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
              <div style={{flex:'1 1 180px'}}>
                <label style={{fontWeight:700,fontSize:'1.1rem'}}>Number of Questions</label>
                <input type="number" min={1} max={10} value={numQuestions} onChange={e=>setNumQuestions(Number(e.target.value))} style={{width:80,margin:'12px 0'}} />
              </div>
              <div style={{flex:'1 1 180px',display:'flex',alignItems:'center',marginTop:28}}>
                <input type="checkbox" checked={explanations} onChange={e=>setExplanations(e.target.checked)} id="explanations" style={{marginRight:8}} />
                <label htmlFor="explanations" style={{fontWeight:500}}>Show explanations after each question</label>
              </div>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="timeout" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30}} transition={{duration:0.5}}>
            <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
              <div style={{flex:'1 1 180px',display:'flex',alignItems:'center'}}>
                <input type="checkbox" checked={useTimeout} onChange={e=>setUseTimeout(e.target.checked)} id="timeout" style={{marginRight:8}} />
                <label htmlFor="timeout" style={{fontWeight:500}}>Enable timeout per question</label>
              </div>
              {useTimeout && (
                <div style={{flex:'1 1 180px',display:'flex',alignItems:'center'}}>
                  <label style={{fontWeight:700,marginRight:8}}>Timeout (seconds)</label>
                  <input type="number" min={5} max={120} value={timeoutDuration} onChange={e=>setTimeoutDuration(Number(e.target.value))} style={{width:70}} />
                </div>
              )}
            </div>
          </motion.div>
        )}
        {step === 4 && (
          <motion.div key="preview" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30}} transition={{duration:0.5}}>
            <label style={{fontWeight:700,fontSize:'1.1rem',marginBottom:12,display:'block'}}>Quiz Preview</label>
            <div className="glass-card" style={{background:'rgba(99,102,241,0.06)',boxShadow:'0 2px 8px #c7d2fe',borderRadius:16,padding:'1.2rem',marginBottom:18}}>
              <div style={{fontWeight:700,fontSize:'1.15rem',marginBottom:8}}>{prompt || 'Quiz Topic'}</div>
              <div style={{display:'flex',gap:12,marginBottom:6}}>
                <span style={{background:'#f1f5f9',padding:'2px 10px',borderRadius:8,fontWeight:600}}>{roles.find(r=>r.value===role).label}</span>
                <span style={{background:'#f1f5f9',padding:'2px 10px',borderRadius:8,fontWeight:600}}>{difficulty.charAt(0).toUpperCase()+difficulty.slice(1)}</span>
                <span style={{background:'#f1f5f9',padding:'2px 10px',borderRadius:8,fontWeight:600}}>{numQuestions} Qs</span>
                {explanations && <span style={{background:'#f1f5f9',padding:'2px 10px',borderRadius:8,fontWeight:600}}>Explanations</span>}
                {useTimeout && <span style={{background:'#f1f5f9',padding:'2px 10px',borderRadius:8,fontWeight:600}}>Timeout: {timeoutDuration}s</span>}
              </div>
            </div>
            <div style={{textAlign:'center'}}>
              <button type="submit" style={{fontSize:'1.15rem',padding:'0.9rem 2.2rem',background:'var(--primary)',borderRadius:'2rem',boxShadow:'0 2px 12px #c7d2fe',fontWeight:700,letterSpacing:'0.5px'}}>
                🚀 Generate Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:28}}>
        <button type="button" onClick={prev} disabled={step===0} style={{opacity:step===0?0.5:1,background:'#e0e7ff',color:'#6366f1',borderRadius:12,padding:'0.6rem 1.2rem',fontWeight:600,border:'none',fontSize:'1rem',display:'flex',alignItems:'center',gap:6}}><FaArrowLeft/> Back</button>
        {step < steps.length-1 && (
          <button
            type="button"
            onClick={next}
            style={{
              background: step === 0 && !prompt.trim() ? '#cbd5e1' : 'var(--primary)',
              color: '#fff',
              borderRadius: 12,
              padding: '0.6rem 1.2rem',
              fontWeight: 600,
              border: 'none',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: step === 0 && !prompt.trim() ? 'not-allowed' : 'pointer',
              opacity: step === 0 && !prompt.trim() ? 0.6 : 1
            }}
            disabled={step === 0 && !prompt.trim()}
          >
            Next <FaArrowRight/>
          </button>
        )}
      </div>
    </form>
  );
}

