import React from 'react';
import './CallToAction.css';

export default function CallToAction(){
  return (
    <section className="cta">
      <div className="cta__inner">
        <h2 className="cta__title">Be Part of the Solution</h2>
        <p className="cta__subtitle">Join farmers, distributors, and communities across Bangladesh in fighting food loss</p>

        <div className="cta__actions">
          <button className="btn btn--cta">Get Started Now <span className="btn__arrow">→</span></button>
          <button className="btn btn--outline">Learn More</button>
        </div>

        <hr className="cta__divider" />

        <p className="cta__small">Together, we can achieve SDG 12.3 and halve food loss by 2030</p>

        <div className="cta__badge">
          <div className="badge-icon">🎯</div>
          <div className="badge-text">Supporting<br/><strong>SDG 12.3</strong></div>
        </div>
      </div>
    </section>
  );
}
