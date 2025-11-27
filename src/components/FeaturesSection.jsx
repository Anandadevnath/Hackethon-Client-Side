import React from 'react';
import './FeaturesSection.css';

export default function FeaturesSection() {
  return (
    <section className="features">
      <div className="features__inner">
        <div className="feature feature--highlight">
          <div className="feature__icon">🚜</div>
          <h3 className="feature__title">Modern Agriculture Equipment</h3>
          <p className="feature__desc">Advanced storage and monitoring solutions to reduce post-harvest losses and preserve crop quality.</p>
        </div>

        <div className="feature">
          <div className="feature__icon feature__icon--mint">🍃</div>
          <h3 className="feature__title">Organic and Fresh Harvest</h3>
          <p className="feature__desc">Real-time crop monitoring ensures optimal harvest timing and maximum nutritional value preservation.</p>
        </div>

        <div className="feature">
          <div className="feature__icon feature__icon--mint">👩‍🌾</div>
          <h3 className="feature__title">Professional & Expert Farmers</h3>
          <p className="feature__desc">Connect with experienced farmers using data-driven insights and AI-powered recommendations.</p>
        </div>
      </div>
    </section>
  );
}
