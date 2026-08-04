import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-50 p-6 ${className}`}>
    {children}
  </div>
);
