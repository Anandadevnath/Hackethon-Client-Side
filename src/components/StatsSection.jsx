import React from 'react';
import './StatsSection.css';

export default function StatsSection(){
  return (
    <section className="stats">
      <div className="stats__inner">
        <div className="stat">
          <div className="stat__value">4.5M</div>
          <div className="stat__label">Tonnes Saved</div>
          <div className="stat__sub">Annual Target</div>
        </div>

        <div className="stat">
          <div className="stat__value">$1.5B</div>
          <div className="stat__label">Economic Value</div>
          <div className="stat__sub">Protected Annually</div>
        </div>

        <div className="stat">
          <div className="stat__value">10K+</div>
          <div className="stat__label">Farmers Helped</div>
          <div className="stat__sub">And Growing</div>
        </div>
      </div>
    </section>
  );
}
