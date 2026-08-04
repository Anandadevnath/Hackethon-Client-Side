import React from "react";
import { motion } from "framer-motion";

export const HowItWorksStep = ({ id, icon, title, desc, img }) => (
  <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 120 }} className="bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,70,40,0.10)] overflow-hidden border border-[#e3f7ec]">
    <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url(${img})` }}>
      <div className="absolute right-3 top-3 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0d6b3c] font-bold text-lg">{id}</div>
    </div>
    <div className="p-6">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold text-[18px] text-[#0c3e25] mb-1">{title}</h3>
      <p className="text-[#577a63] text-sm leading-6">{desc}</p>
    </div>
  </motion.div>
);
