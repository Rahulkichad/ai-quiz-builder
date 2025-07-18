import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import '../pages/Collaborative.css';

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="header">
      <h1>AI Quiz Builder</h1>
      <nav>
        <ul className="nav-list">
          <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/create" className={({isActive}) => isActive ? 'active' : ''}>Create Quiz</NavLink></li>
          <li className="collab-dropdown" ref={dropdownRef}>
            <button
              className="collab-dropdown-btn collab-btn"
              onClick={e => {
                e.preventDefault();
                setDropdownOpen(v => !v);
              }}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              Collaborative Quiz ▾
            </button>
            {dropdownOpen && (
              <div className="collab-dropdown-menu">
                <NavLink to="/collab-create" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setDropdownOpen(false)}>
                  Create Collaborative Quiz
                </NavLink>
                <NavLink to="/collab-join" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setDropdownOpen(false)}>
                  Join Collaborative Quiz
                </NavLink>
              </div>
            )}
          </li>
          <li><NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>Contact</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
