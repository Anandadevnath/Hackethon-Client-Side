import React from "react";
import { motion } from "framer-motion";

export const StatItem = ({ value, label, subLabel }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border border-green-100 text-center"
  >
    <div className="text-4xl font-extrabold text-green-900 mb-2">{value}</div>
    <div className="text-sm font-semibold text-green-800">{label}</div>
    <div className="text-xs text-green-600 mt-1">{subLabel}</div>
  </motion.div>
);
