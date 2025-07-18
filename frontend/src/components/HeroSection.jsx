import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import cityAnimation from '../assets/city-lottie.json'; // Placeholder, you need to add a Lottie JSON file here
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-bg">
        {/* Animated Cityscape */}
        <Lottie
          autoplay
          loop
          animationData={cityAnimation}
          style={{ height: '320px', width: '100%' }}
        />
      </div>
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="hero-title">Build Smarter Quizzes with AI</h1>
        <p className="hero-subtitle">
          Inspired by the best, designed for you. Experience dynamic design and seamless interactivity.
        </p>
        <a href="/create" className="hero-btn">Get Started</a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
