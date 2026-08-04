import React from "react";
import { motion } from "framer-motion";

/**
 * A reusable Button component
 * @param {string} variant - 'primary' or 'secondary'
 * @param {object} props - standard button props + motion props
 */
export const Button = ({ variant = 'primary', children, ...props }) => {
  const baseClasses = "rounded-[28px] px-7 py-3 font-bold transition-all duration-300";
  const variants = {
    primary: "bg-white text-[#067e49] shadow-[0_18px_40px_rgba(0,0,0,0.2)] hover:scale-105",
    secondary: "bg-transparent text-white border border-white/40 hover:bg-white/18 hover:scale-105",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 180 }}
      className={`${baseClasses} ${variants[variant] || variants.primary}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
