import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <NavLink to="/features">Features</NavLink>
        <span className="footer-sep">|</span>
        <NavLink to="/about">About</NavLink>
        <span className="footer-sep">|</span>
        <NavLink to="/contact">Contact</NavLink>
      </div>
      <div className="footer-copy">&copy; {new Date().getFullYear()} AI Quiz Builder</div>
    </footer>
  );
}
