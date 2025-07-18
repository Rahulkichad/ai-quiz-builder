import React from 'react';
import { motion } from 'framer-motion';
import './StatsSection.css';

const stats = [
  { label: 'Quizzes Built', value: '1,200+' },
  { label: 'Questions Generated', value: '15,000+' },
  { label: 'Active Users', value: '800+' },
  { label: 'Satisfaction', value: '99%' },
];

const StatsSection = () => (
  <section className="stats-section">
    <div className="stats-list">
      {stats.map((stat, idx) => (
        <motion.div
          className="stat-card"
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.12 }}
        >
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  </section>
);

export default StatsSection;
