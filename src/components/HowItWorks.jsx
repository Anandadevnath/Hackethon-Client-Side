import React from "react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Data Collection",
      desc: "Monitor storage conditions, temperature, and humidity in real-time",
      img: "https://images.unsplash.com/photo-1503342217505-b0a15d3b6a8f?q=80&w=1000&auto=format&fit=crop",
      icon: "📦",
    },
    {
      id: 2,
      title: "Smart Warnings",
      desc: "Get instant alerts when conditions threaten your stored grains",
      img: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1000&auto=format&fit=crop",
      icon: "🔔",
    },
    {
      id: 3,
      title: "Take Action",
      desc: "Follow guided steps to prevent spoilage and loss",
      img: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1000&auto=format&fit=crop",
      icon: "⚡",
    },
    {
      id: 4,
      title: "Save Food",
      desc: "Reduce waste, increase income, and feed more families",
      img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1000&auto=format&fit=crop",
      icon: "💚",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const stagger = {
    show: { transition: { staggerChildren: 0.18 } },
  };

  return (
    <section className="bg-[#e8f9ef] py-20 px-4">
      <div className="max-w-[1200px] mx-auto">

        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full mx-auto bg-[#dbffe7] flex items-center justify-center text-4xl text-green-700 shadow-[0_10px_40px_rgba(0,120,60,0.15)]">
            ✔️
          </div>

          <h2 className="text-4xl font-extrabold text-[#125f38] mt-4">
            How HarvestGuard Works
          </h2>
          <p className="text-[#226343] opacity-80 mt-2 text-sm">
            Four simple steps to save our harvest
          </p>
        </motion.div>

        {/* BADGES */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          {[
            "✔️ 60% Reduction in Post-Harvest Losses",
            "✔️ Real-Time Monitoring & Alerts",
            "✔️ AI-Powered Crop Health Analysis",
            "✔️ Increased Farmer Income by 40%",
          ].map((b, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white rounded-xl px-6 py-3 shadow-[0_6px_20px_rgba(0,100,40,0.08)] border border-[#daf7e6] text-[#0b703d] font-medium text-sm"
            >
              {b}
            </motion.div>
          ))}
        </motion.div>

        {/* STEPS GRID */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={fadeUp}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,70,40,0.10)] overflow-hidden border border-[#e3f7ec]"
            >
              {/* Image */}
              <div
                className="h-40 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${step.img})` }}
              >
                <div className="absolute right-3 top-3 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0d6b3c] font-bold text-lg">
                  {step.id}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="font-bold text-[18px] text-[#0c3e25] mb-1">
                  {step.title}
                </h3>
                <p className="text-[#577a63] text-sm leading-6">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* BOTTOM FLOW SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-3xl p-10 shadow-[0_20px_45px_rgba(0,80,40,0.10)] max-w-[900px] mx-auto text-center"
        >
          <h3 className="text-[20px] font-extrabold text-[#105f37] mb-6">
            How It Works
          </h3>

          <div className="flex justify-center items-center gap-6 text-[15px] font-semibold text-white">

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              Data
            </div>

            <div className="text-[#0fa451] text-2xl">→</div>

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              Warning
            </div>

            <div className="text-[#0fa451] text-2xl">→</div>

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              Action
            </div>

            <div className="text-[#0fa451] text-2xl">→</div>

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              Saved Food
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
