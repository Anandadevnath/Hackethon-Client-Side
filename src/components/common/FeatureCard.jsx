import React from "react";
import { motion } from "framer-motion";

export const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    whileHover={{ scale: 1.04, y: -8 }}
    transition={{ type: "spring", stiffness: 120, damping: 14, delay }}
    className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-10 shadow-[0_0_50px_rgba(0,150,80,0.20)] hover:shadow-[0_0_60px_rgba(0,200,110,0.35)] text-center"
  >
    <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-4xl backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.15)]">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-green-900 drop-shadow-sm">{title}</h3>
    <p className="text-green-900/80 mt-3 leading-6">{description}</p>
  </motion.div>
);
