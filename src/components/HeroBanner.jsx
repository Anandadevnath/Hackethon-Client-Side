import React from 'react';
import './HeroBanner.css';

export default function HeroBanner() {
  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="hero__content">
        <div className="hero__left">
          <div className="hero__logo">
            <div className="hero__logo-box">🌾</div>
          </div>
          <h1 className="hero__title">
            Bringing Innovation to
            <br />
            Your Farming Journey.
          </h1>

          <p className="hero__desc">
            From precision agriculture to sustainable practices, we help you grow more
            efficiently and profitably. Join us in transforming the way you farm.
          </p>

          <div className="hero__actions">
            <button className="btn btn--primary">Get Started <span className="btn-arrow">→</span></button>
            <button className="btn btn--ghost">Learn More</button>
          </div>
        </div>
        <div className="hero__right">
          <div className="mission-card">
            <div className="mission-card__eyebrow">Our Mission</div>
            <h3 className="mission-card__title">To empower farmers with innovative tools and technology that enhance productivity, sustainability, and efficiency.</h3>
            <p className="mission-card__sub">Learn how we use data and tools to shape the future of farming.</p>
            <a className="mission-card__link" href="#">Learn More →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
