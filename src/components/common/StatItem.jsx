import React from "react";
import { motion } from "framer-motion";

export const StatItem = ({ value, label, subLabel }) => (
  <div>
    <div className="text-3xl md:text-4xl font-bold mb-1">{value}</div>
    <div className="text-sm opacity-95">{label}</div>
    <div className="text-xs opacity-75 mt-1">{subLabel}</div>
  </div>
);
