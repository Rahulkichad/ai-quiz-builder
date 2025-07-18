import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './QuizSetup.css';
import { FaChalkboardTeacher, FaUserGraduate, FaUserTie } from 'react-icons/fa';

const roles = [
  { label: 'Teacher', value: 'teacher' },
  { label: 'Mentor', value: 'mentor' },
  { label: 'Student', value: 'student' },
];
const difficulties = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
];

function QuizSetup({ onGenerate }) {
  const [prompt, setPrompt] = useState('');
  const [role, setRole] = useState('teacher');
  const [difficulty, setDifficulty] = useState('easy');
  const [numQuestions, setNumQuestions] = useState(3);
  const [explanations, setExplanations] = useState(false);
  const [useTimeout, setUseTimeout] = useState(false);
  const [timeoutDuration, setTimeoutDuration] = useState(15);

  const icons = {
    teacher: <FaChalkboardTeacher color="#6366f1" size={24} />,
    mentor: <FaUserTie color="#22c55e" size={24} />,
    student: <FaUserGraduate color="#f59e42" size={24} />
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate({ prompt, role, difficulty, num_questions: numQuestions, explanations, useTimeout, timeoutDuration: useTimeout ? timeoutDuration : null });
    }
  };

  return (
    <motion.form 
        className="quiz-setup vibrant quiz-setup-grid"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h2
          className="quiz-setup-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
        >
          {icons[role]} Create Your AI Quiz
        </motion.h2>
        <div className="quiz-setup-grid-inner">
          <label className="quiz-setup-topic">
            Topic
            <motion.input
              type="text"
              placeholder="e.g. Python Basics"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              required
              whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #6366f1' }}
              transition={{ type: 'spring', stiffness: 350 }}
            />
          </label>
          <label className="quiz-setup-role">
            Role
            <motion.select
              value={role}
              onChange={e => setRole(e.target.value)}
              whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #6366f1' }}
              transition={{ type: 'spring', stiffness: 350 }}
            >
              {roles.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </motion.select>
          </label>
          <label className="quiz-setup-difficulty">
            Difficulty
            <motion.select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #6366f1' }}
              transition={{ type: 'spring', stiffness: 350 }}
            >
              {difficulties.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </motion.select>
          </label>
          <label className="quiz-setup-number">
            Number
            <motion.input
              type="number"
              min={1}
              max={10}
              value={numQuestions}
              onChange={e => setNumQuestions(Number(e.target.value))}
              whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #6366f1' }}
              transition={{ type: 'spring', stiffness: 350 }}
            />
          </label>
          <label className="quiz-setup-explanations ">
            <motion.input
              type="checkbox"
              checked={explanations}
              name="explanations"
              onChange={e => setExplanations(e.target.checked)}
              whileFocus={{ scale: 1.18 }}
              transition={{ type: 'spring', stiffness: 350 }}
            />
            <span>Explanation</span>
          </label>
          <label className="quiz-setup-timeout">
            <motion.input
              type="checkbox"
              checked={useTimeout}
              name="useTimeout"
              onChange={e => setUseTimeout(e.target.checked)}
              whileFocus={{ scale: 1.18 }}
              transition={{ type: 'spring', stiffness: 350 }}
            />
            <span>Timeout per question?</span>
          </label>
          {useTimeout && (
            <label className="quiz-setup-timeout-duration">
              Timeout (seconds)
              <motion.input
                type="number"
                min={5}
                max={120}
                value={timeoutDuration}
                onChange={e => setTimeoutDuration(Number(e.target.value))}
                whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #6366f1' }}
                transition={{ type: 'spring', stiffness: 350 }}
              />
            </label>
          )}
          <motion.button
            type="submit"
            className="quiz-setup-generate-btn"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350 }}
          >
            Generate Quiz
          </motion.button>
        </div>
      </motion.form>
  );
}

export default QuizSetup;
