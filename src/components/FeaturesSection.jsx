import React from "react";
import { useLanguage } from '../context/LanguageContext';
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, description, delay }) => (
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

export default function FeaturesSection() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const features = [
    {
      icon: '🚜',
      title: isBn ? 'আধুনিক কৃষি যন্ত্রপাতি' : 'Modern Agriculture Equipment',
      description: isBn ? 'ফসলের গুণমান সংরক্ষণের জন্য উন্নত সংরক্ষণ ও মনিটরিং সলিউশন, স্মার্ট অটোমেশন ব্যবহার করে।' : 'Advanced storage and monitoring solutions designed to preserve crop quality using smart automation.',
    },
    {
      icon: '🍃',
      title: isBn ? 'জৈব ও তাজা ফসল' : 'Organic & Fresh Harvest',
      description: isBn ? 'রিয়েল-টাইম ফসল সূচক নিশ্চিত করে যে সর্বাধিক তাজা ও পুষ্টিগুণসম্পন্ন ফলাফল বাজারে পৌঁছায়।' : 'Real-time crop insights ensure only the freshest, most nutrient-rich harvest reaches the market.',
    },
    {
      icon: '👩‍🌾',
      title: isBn ? 'পেশাদার ও অভিজ্ঞ কৃষক' : 'Professional & Expert Farmers',
      description: isBn ? 'অভিজ্ঞ কৃষি পেশাজীবীদের সঙ্গে সহযোগিতা করুন যারা ডেটা-চালিত কৌশল ব্যবহার করে সফলতা অর্জন করেন।' : 'Collaborate with experienced farming professionals who use data-driven techniques for success.',
    },
  ];

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-[#e9fff4] via-[#f3fff9] to-[#e7ffee] overflow-hidden">
      {/* Soft Glowing Blobs */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-200/50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-200/50 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} delay={i * 0.12} />
        ))}
      </div>
    </section>
  );
}
