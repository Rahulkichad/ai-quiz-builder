import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

function Header() {

  return (
    <header className="header">
      <h1>AI Quiz Builder</h1>
      <nav>
        <ul className="nav-list">
          <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/create" className={({isActive}) => isActive ? 'active' : ''}>Create Quiz</NavLink></li>
          <li><NavLink to="/quizzes" className={({isActive}) => isActive ? 'active' : ''}>Predefined Quizzes</NavLink></li>
          <li><NavLink to="/india" className={({isActive}) => isActive ? 'active' : ''}>India Quizzes</NavLink></li>
          <li><NavLink to="/features" className={({isActive}) => isActive ? 'active' : ''}>Features</NavLink></li>
          <li><NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>About</NavLink></li>
          <li><NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>Contact</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
