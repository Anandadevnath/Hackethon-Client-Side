import React from "react";
import { motion } from "framer-motion";

/**
 * A reusable Button component
 * @param {string} variant - 'primary' | 'secondary' | 'outline'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {object} props - standard button props + motion props
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = "rounded-[28px] font-bold transition-all duration-300 flex items-center justify-center";

  const variants = {
    primary: "bg-white text-[#067e49] shadow-[0_18px_40px_rgba(0,0,0,0.2)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100",
    secondary: "bg-transparent text-white border border-white/40 hover:bg-white/10 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100",
    outline: "border border-[#067e49] text-[#067e49] hover:bg-[#067e49] hover:text-white disabled:opacity-50",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-7 py-3 text-base",
    lg: "px-10 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={!props.disabled ? { scale: 1.05 } : {}}
      whileTap={!props.disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 180 }}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
