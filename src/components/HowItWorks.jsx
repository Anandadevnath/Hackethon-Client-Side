import React from 'react';
import './HowItWorks.css';

export default function HowItWorks(){
  const steps = [
    {
      id: 1,
      title: 'Data Collection',
      desc: 'Monitor storage conditions, temperature, and humidity in real-time',
      img: 'https://images.unsplash.com/photo-1503342217505-b0a15d3b6a8f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d'
    },
    {
      id: 2,
      title: 'Smart Warnings',
      desc: 'Get instant alerts when conditions threaten your stored grains',
      img: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e'
    },
    {
      id: 3,
      title: 'Take Action',
      desc: 'Follow guided steps to prevent spoilage and loss',
      img: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=8c7b6a5d4e3f2a1b0c9d8e7f6a5b4c3d'
    },
    {
      id: 4,
      title: 'Save Food',
      desc: 'Reduce waste, increase income, and feed more families',
      img: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6'
    }
  ];

  return (
    <section className="how">
      <div className="how__inner">
        <div className="how__header">
          <div className="how__icon">✔️</div>
          <h2 className="how__title">How HarvestGuard Works</h2>
          <p className="how__subtitle">Four simple steps to save our harvest</p>
        </div>

        <div className="how__badges">
          <span className="badge">60% Reduction in Post-Harvest Losses</span>
          <span className="badge">Real-Time Monitoring &amp; Alerts</span>
          <span className="badge">AI-Powered Crop Health Analysis</span>
          <span className="badge">Increased Farmer Income by 40%</span>
        </div>

        <div className="how__steps">
          {steps.map(step => (
            <article key={step.id} className="step-card">
              <div className="step-card__media" style={{backgroundImage:`url(${step.img})`}}>
                <div className="step-card__num">{step.id}</div>
              </div>
              <div className="step-card__body">
                <h3 className="step-card__title">{step.title}</h3>
                <p className="step-card__desc">{step.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
