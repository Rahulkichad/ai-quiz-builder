import React from 'react';
import { motion } from 'framer-motion';
import './FeaturesSection.css';

const features = [
  {
    title: 'AI-Powered Quiz Generation',
    description: 'Instantly generate quizzes from any topic or text using advanced AI models.',
    icon: '🤖',
  },
  {
    title: 'Dynamic Animations',
    description: 'Enjoy a visually rich experience with animated transitions and interactive elements.',
    icon: '✨',
  },
  {
    title: 'Content Customization',
    description: 'Easily adjust and personalize quiz content, appearance, and difficulty.',
    icon: '🛠️',
  },

];

const FeaturesSection = ({ detailed }) => (
  <section className="features-section">
    <h2 className="features-title">Features</h2>
    <div className="features-list">
      {features.map((feature, idx) => (
        <motion.div
          className="feature-card"
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.15 }}
        >
          <span className="feature-icon">{feature.icon}</span>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          {detailed && <p className="feature-detail">More details about {feature.title} coming soon!</p>}
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeaturesSection;
