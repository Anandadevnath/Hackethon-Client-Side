// About.jsx
import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import bg from "../assets/bg.png";

const STRINGS = {
  en: {
    headerTitle: "Advancing SDG 12.3 Through",
    headerHighlight: " Food Loss Reduction",
    headerDesc:
      "Our mission is to build sustainable and climate-resilient food systems in Bangladesh. This involves reducing food loss from farms to markets through innovation, analytics, and community-driven solutions.",
    whyTitle: "Why Food Loss Matters",
    whyDesc:
      "Food loss is a critical yet often overlooked challenge in Bangladesh. Studies from the FAO and the Ministry of Food indicate that **12–32%** of food is lost across different supply chain stages—harvesting, storage, transport, and retail. These losses contribute to:",
    bullet1: "Reduced farmer income and increased production costs",
    bullet2: "Higher market prices for consumers",
    bullet3: "Food insecurity in vulnerable communities",
    bullet4: "Environmental degradation and carbon footprint",
    missionTitle: "Our Mission",
    missionDesc:
      "Our work focuses on building a **data-driven food loss monitoring system**, working with farmers, supply chain operators, researchers, and policymakers. By connecting ground-level data with national SDG reporting frameworks, we support informed decisions and sustainable food system development.",
    quote:
      "\"Reducing food loss is one of the fastest, most cost-effective climate and food security solutions available to Bangladesh.\"",
  },
  bn: {
    headerTitle: "SDG 12.3 অগ্রগতি",
    headerHighlight: " খাদ্য অপচয় হ্রাসের মাধ্যমে",
    headerDesc:
      "আমাদের লক্ষ্য বাংলাদেশে টেকসই ও জলবায়ু-সহনশীল খাদ্য ব্যবস্থা গড়ে তোলা। উদ্ভাবন, বিশ্লেষণ এবং সম্প্রদায়ভিত্তিক সমাধানের মাধ্যমে খামার থেকে বাজার পর্যন্ত খাদ্য অপচয় কমানো।",
    whyTitle: "খাদ্য অপচয় কেন গুরুত্বপূর্ণ",
    whyDesc:
      "বাংলাদেশে খাদ্য অপচয় একটি গুরুতর কিন্তু প্রায়শই উপেক্ষিত সমস্যা। FAO এবং খাদ্য মন্ত্রণালয়ের গবেষণা অনুযায়ী, সরবরাহ শৃঙ্খলার বিভিন্ন পর্যায়ে—ফসল কাটা, সংরক্ষণ, পরিবহন এবং খুচরা বিক্রয়ে—**১২–৩২%** খাদ্য নষ্ট হয়। এই ক্ষতি যা ঘটায়:",
    bullet1: "কৃষকের আয় হ্রাস এবং উৎপাদন খরচ বৃদ্ধি",
    bullet2: "ভোক্তাদের জন্য বাজার মূল্য বৃদ্ধি",
    bullet3: "ঝুঁকিপূর্ণ সম্প্রদায়ে খাদ্য নিরাপত্তাহীনতা",
    bullet4: "পরিবেশগত ক্ষতি এবং কার্বন পদচিহ্ন বৃদ্ধি",
    missionTitle: "আমাদের মিশন",
    missionDesc:
      "আমাদের কাজ হলো কৃষক, সরবরাহ শৃঙ্খল অপারেটর, গবেষক এবং নীতিনির্ধারকদের সাথে মিলে একটি **ডেটা-চালিত খাদ্য অপচয় পর্যবেক্ষণ ব্যবস্থা** তৈরি করা। মাঠ পর্যায়ের তথ্যকে জাতীয় SDG রিপোর্টিং কাঠামোর সাথে সংযুক্ত করে, আমরা সচেতন সিদ্ধান্ত এবং টেকসই খাদ্য ব্যবস্থার উন্নয়নে সহায়তা করি।",
    quote:
      "\"খাদ্য অপচয় হ্রাস বাংলাদেশের জন্য সবচেয়ে দ্রুত এবং সাশ্রয়ী জলবায়ু ও খাদ্য নিরাপত্তা সমাধানগুলোর একটি।\"",
  },
};

const About = () => {
  const { lang } = useLanguage();
  const t = STRINGS[lang] || STRINGS.en;

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
            {t.headerTitle}
            <span className="text-green-400">{t.headerHighlight}</span>
          </h1>

          <p className="text-gray-200 text-sm md:text-lg mt-4 max-w-3xl mx-auto">
            {t.headerDesc}
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
          {t.whyTitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-gray-700 leading-relaxed text-lg"
        >
          {t.whyDesc}
        </motion.p>

        <ul className="list-disc ml-6 mt-4 text-gray-700 leading-relaxed">
          <li>{t.bullet1}</li>
          <li>{t.bullet2}</li>
          <li>{t.bullet3}</li>
          <li>{t.bullet4}</li>
        </ul>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 mt-12 mb-4"
        >
          {t.missionTitle}
        </motion.h3>

        <p className="text-gray-700 leading-relaxed text-lg">
          {t.missionDesc}
        </p>

        <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-600 my-10">
          {t.quote}
        </blockquote>
      </div>
    </div>
  );
};

export default About;
