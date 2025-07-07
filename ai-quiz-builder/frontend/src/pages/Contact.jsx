import React from 'react';
import { FaUser, FaEnvelope, FaCommentDots, FaPaperPlane, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const team = [
  { name: 'Rahul Choudhary', role: 'Founder & Lead Developer', email: 'rahul@example.com', linkedin: 'https://linkedin.com/in/rahulchoudhary' },
  { name: 'Priya Mehta', role: 'UI/UX Designer', email: 'priya@example.com', linkedin: 'https://linkedin.com/in/priyamehta' },
];

const Contact = () => (
  <main style={{
    background: 'var(--background)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    padding: '2.5rem 2rem',
    margin: '2.5rem auto',
    maxWidth: 600
  }}>
    <h2 style={{textAlign:'center', color:'var(--primary)', fontSize:'2.1rem', marginBottom:'1.2rem', fontWeight:800}}>Contact <span style={{color:'var(--accent)'}}>Us</span></h2>
    <p style={{textAlign:'center', color:'var(--text)', marginBottom:32, fontSize:'1.13rem'}}>
      We’d love to hear from you! Whether you have questions, feedback, or want to collaborate, reach out anytime.
    </p>
    <section style={{marginBottom:36}}>
      <h3 style={{color:'var(--primary)', fontSize:'1.2rem', marginBottom:12}}>Contact Owner</h3>
      <div style={{background:'var(--card)',borderRadius:12,padding:'1rem 1.2rem',boxShadow:'0 2px 8px #e0e7ff',maxWidth:350}}>
        <div style={{fontWeight:700, fontSize:'1.1rem', marginBottom:4}}>Rahul khichad</div>
        <div style={{fontSize:'0.97rem', marginBottom:4}}><FaEnvelope style={{marginRight:6}}/>kichadrahul@gmail.com</div>
        <a href="https://www.linkedin.com/in/rahulkichad/" style={{color:'#0a66c2',textDecoration:'none',fontSize:'1rem'}} target="_blank" rel="noopener noreferrer"><FaLinkedin style={{marginRight:4}}/>LinkedIn</a>
      </div>
    </section>
    <section style={{marginBottom:36}}>
      <h3 style={{color:'var(--primary)', fontSize:'1.2rem', marginBottom:12}}>Other Ways to Connect</h3>
      <div style={{display:'flex',gap:20,marginBottom:12}}>
        <a href="mailto:info@aiquiz.com" style={{color:'var(--primary)',fontWeight:700,fontSize:'1.1rem',display:'flex',alignItems:'center',gap:6,textDecoration:'none'}}><FaEnvelope/> info@aiquiz.com</a>
        <a href="https://github.com/aiquiz" style={{color:'#23272f',fontWeight:700,fontSize:'1.1rem',display:'flex',alignItems:'center',gap:6,textDecoration:'none'}} target="_blank" rel="noopener noreferrer"><FaGithub/> GitHub</a>
        <a href="https://twitter.com/aiquiz" style={{color:'#1da1f2',fontWeight:700,fontSize:'1.1rem',display:'flex',alignItems:'center',gap:6,textDecoration:'none'}} target="_blank" rel="noopener noreferrer"><FaTwitter/> Twitter</a>
      </div>
    </section>
    <form className="contact-form" style={{
      background:'var(--card)',
      borderRadius:'12px',
      boxShadow:'0 2px 8px #e0e7ff',
      padding:'2rem 1.2rem',
      display:'flex',
      flexDirection:'column',
      gap:'1.3rem',
      maxWidth:480,
      margin:'0 auto'
    }}>
      <label style={{display:'flex', alignItems:'center', gap:'0.7rem', color:'var(--primary)', fontWeight:500}}>
        <FaUser size={18}/> Name
        <input type="text" name="name" required style={{flex:1, padding:'0.7rem', borderRadius:'8px', border:'1.5px solid #6366f1', fontSize:'1.07rem'}}/>
      </label>
      <label style={{display:'flex', alignItems:'center', gap:'0.7rem', color:'var(--accent)', fontWeight:500}}>
        <FaEnvelope size={18}/> Email
        <input type="email" name="email" required style={{flex:1, padding:'0.7rem', borderRadius:'8px', border:'1.5px solid #22c55e', fontSize:'1.07rem'}}/>
      </label>
      <label style={{display:'flex', alignItems:'center', gap:'0.7rem', color:'#f59e42', fontWeight:500}}>
        <FaCommentDots size={18}/> Message
        <textarea name="message" rows="4" required style={{flex:1, padding:'0.7rem', borderRadius:'8px', border:'1.5px solid #f59e42', fontSize:'1.07rem'}}></textarea>
      </label>
      <button type="submit" style={{
        background:'var(--primary)',
        color:'#fff',
        border:'none',
        padding:'0.85rem 2rem',
        borderRadius:'999px',
        fontSize:'1.12rem',
        fontWeight:700,
        cursor:'pointer',
        marginTop:'1.2rem',
        boxShadow:'0 2px 8px #dbeafe',
        letterSpacing:'0.01em',
        display:'inline-flex',
        alignItems:'center',
        gap:'0.7rem',
        transition:'background 0.25s, transform 0.18s'
      }}>
        <FaPaperPlane /> Send
      </button>
    </form>
  </main>
);

export default Contact;
