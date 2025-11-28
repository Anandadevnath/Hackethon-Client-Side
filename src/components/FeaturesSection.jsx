import React from "react";
import { useLanguage } from '../context/LanguageContext';
import { motion } from "framer-motion";

export default function FeaturesSection() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const cardVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.04, y: -8 }
  };

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-[#e9fff4] via-[#f3fff9] to-[#e7ffee] overflow-hidden">

      {/* Soft Glowing Blobs (hidden on very small screens) */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute top-10 left-10 w-60 h-60 bg-green-300/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-300/40 rounded-full blur-[100px]"></div>
      </div>

      <motion.div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={{ show: { transition: { staggerChildren: 0.12 } } }}>

        {/* Highlight Card */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          whileHover="hover"
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-10 shadow-[0_0_50px_rgba(0,150,80,0.20)] hover:shadow-[0_0_60px_rgba(0,200,110,0.35)] text-center"
        >
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-4xl backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            🚜
          </div>

          <h3 className="text-xl font-bold text-green-900 drop-shadow-sm">
            {isBn ? 'আধুনিক কৃষি যন্ত্রপাতি' : 'Modern Agriculture Equipment'}
          </h3>

          <p className="text-green-900/80 mt-3 leading-6">
            {isBn ? 'ফসলের গুণমান সংরক্ষণের জন্য উন্নত সংরক্ষণ ও মনিটরিং সলিউশন, স্মার্ট অটোমেশন ব্যবহার করে।' : 'Advanced storage and monitoring solutions designed to preserve crop quality using smart automation.'}
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          whileHover="hover"
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-10 shadow-[0_0_40px_rgba(0,130,60,0.15)] hover:shadow-[0_0_55px_rgba(0,160,70,0.30)] text-center"
        >
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-4xl backdrop-blur-md">
            🍃
          </div>

          <h3 className="text-xl font-bold text-green-900">
            {isBn ? 'জৈব ও তাজা ফসল' : 'Organic & Fresh Harvest'}
          </h3>

          <p className="text-green-900/80 mt-3 leading-6">
            {isBn ? 'রিয়েল-টাইম ফসল সূচক নিশ্চিত করে যে সর্বাধিক তাজা ও পুষ্টিগুণসম্পন্ন ফলাফল বাজারে পৌঁছায়।' : 'Real-time crop insights ensure only the freshest, most nutrient-rich harvest reaches the market.'}
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          whileHover="hover"
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-10 shadow-[0_0_40px_rgba(0,130,60,0.15)] hover:shadow-[0_0_55px_rgba(0,160,70,0.30)] text-center"
        >
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-4xl backdrop-blur-md">
            👩‍🌾
          </div>

          <h3 className="text-xl font-bold text-green-900">
            {isBn ? 'পেশাদার ও অভিজ্ঞ কৃষক' : 'Professional & Expert Farmers'}
          </h3>

          <p className="text-green-900/80 mt-3 leading-6">
            {isBn ? 'অভিজ্ঞ কৃষি পেশাজীবীদের সঙ্গে সহযোগিতা করুন যারা ডেটা-চালিত কৌশল ব্যবহার করে সফলতা অর্জন করেন।' : 'Collaborate with experienced farming professionals who use data-driven techniques for success.'}
          </p>
        </motion.div>

      </motion.div>
    </section>
  );
}
