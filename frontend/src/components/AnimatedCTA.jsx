import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import rocketAnim from '../assets/rocket-lottie.json'; // Placeholder, you can swap for a better Lottie
import './AnimatedCTA.css';

const AnimatedCTA = () => (
  <section className="cta-section">
    <div className="cta-content">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Ready to build your next quiz?
      </motion.h2>
      <motion.a
        href="/create"
        className="cta-btn"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.97 }}
      >
        Start Now
      </motion.a>
    </div>
    <div className="cta-animation">
      <Lottie autoplay loop animationData={rocketAnim} style={{ height: '120px', width: '120px' }} />
    </div>
  </section>
);

export default AnimatedCTA;
