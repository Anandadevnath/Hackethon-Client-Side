// About.jsx
import React from "react";
import { motion } from "framer-motion";
import bg from "../assets/bg.png";

const About = () => {
  return (
    <div id="about" className="w-full min-h-screen bg-gray-50 flex flex-col">

      {/* ------------------------- HEADER SECTION ------------------------- */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">

        {/* Background Image */}
        <img
          src={bg}
          alt="SDG Food Loss Background"
          className="w-full h-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>

        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute bottom-10 md:bottom-16 left-1/2 transform -translate-x-1/2 text-center w-full px-6"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
            Advancing SDG 12.3 Through  
            <span className="text-green-400"> Food Loss Reduction</span>
          </h1>

          <p className="text-gray-200 text-sm md:text-lg mt-4 max-w-3xl mx-auto">
            Our mission is to build sustainable and climate-resilient food systems in Bangladesh.
            This involves reducing food loss from farms to markets through innovation, analytics,
            and community-driven solutions.
          </p>
        </motion.div>
      </div>

      {/* ------------------------- BODY SECTION ------------------------- */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
        >
          Why Food Loss Matters
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-gray-700 leading-relaxed text-lg"
        >
          Food loss is a critical yet often overlooked challenge in Bangladesh. Studies from the
          FAO and the Ministry of Food indicate that **12–32%** of food is lost across different
          supply chain stages—harvesting, storage, transport, and retail. These losses contribute to:
        </motion.p>

        <ul className="list-disc ml-6 mt-4 text-gray-700 leading-relaxed">
          <li>Reduced farmer income and increased production costs</li>
          <li>Higher market prices for consumers</li>
          <li>Food insecurity in vulnerable communities</li>
          <li>Environmental degradation and carbon footprint</li>
        </ul>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 mt-12 mb-4"
        >
          Our Mission
        </motion.h3>

        <p className="text-gray-700 leading-relaxed text-lg">
          Our work focuses on building a **data-driven food loss monitoring system**, working with
          farmers, supply chain operators, researchers, and policymakers. By connecting ground-level
          data with national SDG reporting frameworks, we support informed decisions and sustainable food system development.
        </p>

        <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-600 my-10">
          “Reducing food loss is one of the fastest, most cost-effective climate and food security
          solutions available to Bangladesh.”
        </blockquote>
      </div>
    </div>
  );
};

export default About;
