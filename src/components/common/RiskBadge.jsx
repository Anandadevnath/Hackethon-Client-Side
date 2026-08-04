import React from 'react';

/**
 * A reusable RiskBadge component
 * @param {string} level - 'high' | 'medium' | 'low'
 * @param {string} lang - 'en' | 'bn'
 */
export const RiskBadge = ({ level, lang }) => {
  const lvl = (level || "low").toString().toLowerCase();
  const labels = {
    high: { en: "High", bn: "উচ্চ" },
    medium: { en: "Medium", bn: "মাঝারি" },
    low: { en: "Low", bn: "নিম্ন" },
  };
  const label = labels[lvl] || labels.low;

  const baseClasses = "px-3 py-1 rounded-full text-sm font-semibold";
  const styles = {
    high: "bg-red-50 text-red-700",
    medium: "bg-yellow-50 text-yellow-700",
    low: "bg-green-50 text-green-800",
  };

  return (
    <span className={`${baseClasses} ${styles[lvl] || styles.low}`}>
      {lang === 'bn' ? label.bn : label.en}
    </span>
  );
};
