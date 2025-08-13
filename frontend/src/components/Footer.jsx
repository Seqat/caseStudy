// components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">&copy; 2025 Your Company</p>
      <ul className="footer-list">
        <li className="footer-item">
          <a href="#" className="footer-link">
            Terms of Service
          </a>
        </li>
        <li className="footer-item">
          <a href="#" className="footer-link">
            Privacy Policy
          </a>
        </li>
        <li className="footer-item">
          <a href="#" className="footer-link">
            Contact Us
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;