import React from 'react';
import './footer.scss';

interface FooterProps {
  isCompact?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isCompact = false }) => {
  return (
    <footer className={`footer ${isCompact ? 'compact' : ''}`}>
      <div className="footer-content">
        <div className="footer-sections">
          <div className="footer-section">
            <h3>About LOMIA</h3>
            <p>Live AI mock interviews powered by Gemini, helping candidates prepare for technical interviews through realistic simulations.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/features">Features</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-icons">
              <a href="mailto:contact@lomia.ai" className="material-symbols-outlined">mail</a>
              <a href="https://twitter.com/lomia_ai" className="material-symbols-outlined">alternate_email</a>
              <a href="https://lomia.ai" className="material-symbols-outlined">public</a>
              <a href="https://community.lomia.ai" className="material-symbols-outlined">forum</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 LOMIA - Live AI Mock Interviews. All rights reserved.</p>
          <div className="theme-toggle">
            <button className="material-symbols-outlined">light_mode</button>
            <button className="material-symbols-outlined">dark_mode</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 