import React from 'react';
import './footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-sections">
          <div className="footer-section">
            <h3>About LOMIA</h3>
            <p>Live AI mock interviews powered by Gemini, helping candidates prepare for technical interviews through realistic simulations.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-icons">
              <a href="#" className="material-symbols-outlined">mail</a>
              <a href="#" className="material-symbols-outlined">alternate_email</a>
              <a href="#" className="material-symbols-outlined">public</a>
              <a href="#" className="material-symbols-outlined">forum</a>
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