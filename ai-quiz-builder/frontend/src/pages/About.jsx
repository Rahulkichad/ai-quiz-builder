import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaUsers, FaCode } from 'react-icons/fa';

const timeline = [
  {
    icon: <FaRocket color="#6366f1" size={28} />,
    title: 'Our Vision',
    desc: 'Revolutionize quiz creation with AI, making learning fun and interactive for everyone.'
  },
  {
    icon: <FaUsers color="#22c55e" size={28} />,
    title: 'The Team',
    desc: 'A passionate group of engineers, designers, and educators inspired by the best in the industry.'
  },
  {
    icon: <FaCode color="#f59e42" size={28} />,
    title: 'Tech Stack',
    desc: 'Built with React, Framer Motion, and Lottie for a modern, animated web experience.'
  }
];

const About = () => (
  <motion.main 
    initial={{opacity:0, y:30}} 
    animate={{opacity:1, y:0}} 
    transition={{duration:0.8}}
    style={{
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 60%, #fef9c3 100%)',
      borderRadius: '24px',
      boxShadow: '0 8px 32px rgba(99,102,241,0.10)',
      padding: '2.5rem 2rem',
      margin: '2.5rem auto',
      maxWidth: 700
    }}
  >
    <h2 style={{textAlign:'center', color:'#23254c', fontSize:'2.2rem', marginBottom:'2.2rem', fontWeight:700}}>About <span style={{color:'#6366f1'}}>AI Quiz Builder</span></h2>
    <div style={{display:'flex', flexDirection:'column', gap:'2.2rem'}}>
      {timeline.map((item, idx) => (
        <motion.div
          key={item.title}
          initial={{opacity:0, x:-30}}
          whileInView={{opacity:1, x:0}}
          viewport={{once:true}}
          transition={{duration:0.7, delay:idx*0.15}}
          style={{
            display:'flex',
            alignItems:'center',
            gap:'1.5rem',
            background:'rgba(255,255,255,0.93)',
            borderRadius:'18px',
            boxShadow:'0 2px 8px rgba(99,102,241,0.10)',
            padding:'1.3rem 1.2rem'
          }}
        >
          <div>{item.icon}</div>
          <div>
            <h3 style={{margin:'0 0 0.3rem 0', color:'#6366f1', fontSize:'1.3rem', fontWeight:600}}>{item.title}</h3>
            <p style={{margin:0, color:'#23254c', fontSize:'1.07rem'}}>{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.main>
);

export default About;
