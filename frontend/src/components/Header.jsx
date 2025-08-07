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
          <li><NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>Contact</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
