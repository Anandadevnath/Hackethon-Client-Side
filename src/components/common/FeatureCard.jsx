import React from "react";
import { motion } from "framer-motion";

export const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    whileHover={{ scale: 1.02, y: -4 }}
    transition={{ type: "spring", stiffness: 120, damping: 14, delay }}
    className="bg-white rounded-3xl p-8 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] border border-gray-100 text-center h-full flex flex-col items-center"
  >
    <div className="w-16 h-16 mb-6 rounded-2xl bg-green-50 flex items-center justify-center text-3xl">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-green-950">{title}</h3>
    <p className="text-gray-600 mt-3 leading-relaxed flex-grow">{description}</p>
  </motion.div>
);
