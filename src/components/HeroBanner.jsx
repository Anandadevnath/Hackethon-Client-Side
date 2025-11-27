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
            Freshly
            <br />
            Handpicked
            <br />
            From
            <br />
            Farmers To You
          </h1>

          <p className="hero__desc">
            Fighting food loss with smart technology. Every grain saved is a step toward
            food security.
          </p>

          <div className="hero__actions">
            <button className="btn btn--primary">Join Us</button>
            <button className="btn btn--outline">Know More</button>
          </div>
        </div>

        <div className="hero__right">
          <div
            className="card card--tall"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1524594154904-6f7f6d7f0a8f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=5f9a6b3a5a3f5c1e4d7f3c2b5a6e7d8c')",
            }}
          >
            <div className="card__caption">Our Farmers</div>
          </div>

          <div className="card-stack">
            <div
              className="card card--small card--top"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=ea8d9c6f2b6f4c0e2c3b4a5d6e7f8a9b')",
              }}
            >
              <div className="card__caption card__caption--light">The Crisis</div>
            </div>

            <div
              className="card card--small card--bottom"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c4b2a1f0e6d7c8b9a0f1e2d3c4b5a6b')",
              }}
            >
              <div className="card__caption">Fresh Harvest</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
