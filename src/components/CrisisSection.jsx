import React from 'react';
import './CrisisSection.css';

export default function CrisisSection(){
  return (
    <section className="crisis">
      <div className="crisis__inner">
        <div className="crisis__left">
          <div className="crisis__alert">⚠️</div>
          <h2 className="crisis__title">The Crisis We Face</h2>
          <p className="crisis__lead">Bangladesh loses billions in food every year. This isn't just numbers—it's real hunger, wasted resources, and broken dreams.</p>

          <ul className="crisis__points">
            <li>ফসল সংগ্রহের পরবর্তী ক্ষতি ধান, গম এবং সবজি‌তে সবচেয়ে বেশি প্রভাব ফেলে</li>
            <li>অপর্যাপ্ত সংরক্ষণ সুবিধা এবং দুর্বল অবকাঠামো প্রধান কারণ</li>
            <li>জলবায়ু পরিবর্তন ও অনিশ্চিত আবহাওয়া পরিস্থিতি আরও বাড়ায়</li>
          </ul>
        </div>

        <div className="crisis__right">
          <div className="map-card">
            <div className="map-card__header">Food Loss Risk Map</div>
            <div className="map-card__mock"> 
              {/* Placeholder for a map / visualization */}
              <div className="map-placeholder">Map</div>
            </div>
            <div className="map-card__legend">
              <span className="legend legend--high">High Risk</span>
              <span className="legend legend--med">Medium Risk</span>
              <span className="legend legend--low">Low Risk</span>
            </div>
          </div>
        </div>
      </div>

      <div className="crisis__metrics">
        <div className="metric-card">
          <div className="metric-card__icon">📉</div>
          <div className="metric-card__value">0.0M</div>
          <div className="metric-card__label">Metric Tonnes Lost Annually</div>
        </div>

        <div className="metric-card">
          <div className="metric-card__icon">💲</div>
          <div className="metric-card__value">$0.0B</div>
          <div className="metric-card__label">Economic Loss Per Year</div>
        </div>

        <div className="metric-card">
          <div className="metric-card__icon">⚠️</div>
          <div className="metric-card__value">0M+</div>
          <div className="metric-card__label">People Facing Food Insecurity</div>
        </div>
      </div>
    </section>
  );
}
