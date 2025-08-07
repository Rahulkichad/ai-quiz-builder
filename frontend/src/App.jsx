import './App.css';
import './components/global-responsive.css';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import QuizBuilder from './components/QuizBuilder';
import PredefinedQuizzes from './pages/PredefinedQuizzes';
import IndiaQuizzes from './pages/IndiaQuizzes';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<div className="app-container"><QuizBuilder /></div>} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/quizzes" element={<PredefinedQuizzes />} />
        <Route path="/india" element={<IndiaQuizzes />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
