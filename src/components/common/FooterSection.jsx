import React from "react";
import { motion } from "framer-motion";

export const FooterSection = ({ title, items, children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <div className="text-xl font-semibold text-[#fffbe6] mb-3">{title}</div>
    {children || items.map((item, i) => (
      <a key={i} className="block text-[#e6ffe6] mb-2 hover:text-[#0af58a] transition-colors" href="#">
        {item}
      </a>
    ))}
  </motion.div>
);
