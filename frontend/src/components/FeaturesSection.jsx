import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import './FeaturesSection.css';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const quizTypes = [
  {
    title: 'AI-Powered Quiz',
    description: 'Create custom quizzes on any topic using AI',
    icon: '🤖',
    path: '/create',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
  },
  {
    title: 'Predefined Quizzes',
    description: 'Choose from our collection of ready-made quizzes',
    icon: '📚',
    path: '/quizzes',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
  },
  {
    title: 'India Quizzes',
    description: 'Test your knowledge about India',
    icon: '🇮🇳',
    path: '/india',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
  }
];

const features = [
  {
    title: 'AI-Powered Generation',
    description: 'Generate quizzes from any topic instantly with our advanced AI technology',
    icon: '⚡',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%)'
  },
  {
    title: 'Interactive Experience',
    description: 'Enjoy smooth animations and fully responsive design on all devices',
    icon: '🎮',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
  },
  {
    title: 'Detailed Analytics',
    description: 'Track your progress and get valuable insights about your performance',
    icon: '📊',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
  }
];

const FeatureCard = ({ feature, onClick, type = 'quiz', variants }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      className={`feature-card ${type}-card`}
      onClick={onClick}
      whileHover={{ 
        y: -8,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      whileTap={{ scale: 0.98 }}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={variants || item}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="feature-icon-wrapper"
        style={{ background: feature.gradient }}
      >
        <div className="feature-icon">
          {feature.icon}
        </div>
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
      {type === 'quiz' && (
        <motion.div 
          className="cta-button"
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          Get Started →
        </motion.div>
      )}
    </motion.div>
  );
};

const FeaturesSection = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const handleCardClick = (path) => {
    if (path) {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  return (
    <section className="features-section" ref={ref}>
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span className="section-subtitle">What We Offer</span>
        <h2 className="section-title">Amazing Features</h2>
        <p className="section-description">Experience the power of our quiz platform with these amazing features</p>
      </motion.div>

      <div className="section-divider"></div>
      
      <motion.div 
        className="section-container"
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <div className="features-grid">
          {quizTypes.map((quiz, index) => (
            <FeatureCard 
              key={quiz.title}
              feature={quiz}
              onClick={() => handleCardClick(quiz.path)}
              type="quiz"
              variants={item}
            />
          ))}
        </div>
        
        <div className="features-grid mt-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title}
              feature={feature}
              type="feature"
              variants={item}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
