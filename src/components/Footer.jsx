import React from "react";
import "./Footer.css";
import logo from "../assets/react.svg";

const Footer = () => (
  <footer className="footer">
    <div className="footer-main">
      <div className="footer-brand">
          <div className="footer-logo"><img src={logo} alt="HarvestGuard Logo" /></div>
        <div>
          <div className="footer-title">HarvestGuard</div>
          <div className="footer-desc">
            Empowering Bangladeshi farmers with smart technology to reduce food waste, protect harvests, and ensure food security for every family.
          </div>
          <div className="footer-contact">
            <div><span role="img" aria-label="location">📍</span> Dhaka, Bangladesh</div>
            <div><span role="img" aria-label="phone">📞</span> +880 1XXX-XXXXXX</div>
            <div><span role="img" aria-label="email">✉️</span> support@harvestguard.bd</div>
          </div>
          <div className="footer-social">
            <a href="#" aria-label="Facebook" className="footer-social-btn">&#xf09a;</a>
            <a href="#" aria-label="Twitter" className="footer-social-btn">&#xf099;</a>
            <a href="#" aria-label="Instagram" className="footer-social-btn">&#xf16d;</a>
            <a href="#" aria-label="YouTube" className="footer-social-btn">&#xf167;</a>
          </div>
        </div>
      </div>
      <div className="footer-links">
        <div>
          <div className="footer-link-title">Quick Links</div>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Dashboard</a>
          <a href="#">Login</a>
        </div>
        <div>
          <div className="footer-link-title">Resources</div>
          <a href="#">Training Videos</a>
          <a href="#">Help Center</a>
          <a href="#">FAQs</a>
          <a href="#">Community Forum</a>
        </div>
        <div>
          <div className="footer-link-title">Legal</div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Data Security</a>
          <div className="footer-partners">
            <span>Partners</span>
            <button>DAE</button>
            <button>FAO</button>
            <button>UNDP</button>
          </div>
        </div>
      </div>
    </div>
    <div className="footer-divider"></div>
    <div className="footer-bottom">
      <div className="footer-copyright">
        © 2025 HarvestGuard. All rights reserved.
      </div>
      <div className="footer-sdg">
        <span className="footer-sdg-icon">🎯</span>
        <span>SDG 12.3</span>
        <a href="#" target="_blank" rel="noopener noreferrer">Learn More <span className="footer-ext-link">↗</span></a>
      </div>
    </div>
    <div className="footer-privacy">
      HarvestGuard is committed to data privacy and security. We never collect personally identifiable information (PII) without explicit consent. All data is encrypted and stored securely in compliance with Bangladesh Data Protection regulations. Offline capabilities ensure farmers can access critical information even without internet connectivity.
    </div>
    <div className="footer-hotline">
      <span className="footer-hotline-icon">📞</span>
      <span>24/7 Farmer Hotline</span>
      <span className="footer-hotline-number">16123</span>
    </div>
  </footer>
);

export default Footer;
