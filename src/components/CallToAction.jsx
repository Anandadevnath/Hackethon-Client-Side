import React from "react";
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden text-white 
        bg-[linear-gradient(180deg,#0aa460_0%,#0a8f58_60%,#067e4b_100%)] py-24 px-4">

      {/* FLOATING WAVES BACKGROUND */}
      <div className="relative max-w-[1180px] mx-auto text-center px-4">
        {/* TITLE */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-lg"
        >
          Be Part of the Solution
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-white/90 text-lg mb-8"
        >
          Join farmers, distributors, and communities across Bangladesh in fighting food loss
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          {/* Button 1 */}
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0px 20px 40px rgba(255,255,255,0.25)" }}
            transition={{ type: "spring", stiffness: 180 }}
            className="rounded-[28px] px-7 py-3 font-bold bg-white text-[#067e49] 
            shadow-[0_18px_40px_rgba(0,0,0,0.2)] inline-flex items-center"
          >
            <span className="mr-2">✨</span> Get Started Now →
          </motion.button>

          {/* Button 2 */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.18)" }}
            transition={{ type: "spring", stiffness: 180 }}
            className="rounded-[28px] px-6 py-3 font-bold bg-transparent text-white 
            border border-white/40"
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* DIVIDER */}
        <motion.hr
          initial={{ width: "0%" }}
          whileInView={{ width: "55%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="border-0 h-[1px] bg-white/20 mx-auto mb-6"
        />

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-white/85 mb-6 text-sm tracking-wide"
        >
          Together, we can achieve <strong>SDG 12.3</strong> and halve food loss by 2030
        </motion.p>

        {/* SDG BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md 
          rounded-full px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#067e4b] text-xl"
          >
            🎯
          </motion.div>

          <div className="text-left text-[14px] leading-tight">
            <span className="opacity-80">Supporting</span>
            <br />
            <strong className="text-white">SDG 12.3</strong>
          </div>
        </motion.div>
      </div>

      {/* WAVES ANIMATION KEYFRAMES */}
      <style>{`
        @keyframes wave {
          0% { background-position-x: 0; }
          100% { background-position-x: 1000px; }
        }
      `}</style>
    </section>
  );
}
