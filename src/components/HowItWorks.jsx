import { motion } from "framer-motion";
import { useLanguage } from '../context/LanguageContext';
import { HowItWorksStep } from "./common/HowItWorksStep";
import img1 from '../assets/1.png';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.png';
import img4 from '../assets/4.jpg';

export default function HowItWorks() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const steps = [
    {
      id: 1,
      title: "Data Collection",
      desc: "Monitor storage conditions, temperature, and humidity in real-time",
      img: img4,
      icon: "📦",
    },
    {
      id: 2,
      title: "Smart Warnings",
      desc: "Get instant alerts when conditions threaten your stored grains",
      img: img3,
      icon: "🔔",
    },
    {
      id: 3,
      title: "Take Action",
      desc: "Follow guided steps to prevent spoilage and loss",
      img: img2,
      icon: "⚡",
    },
    {
      id: 4,
      title: "Save Food",
      desc: "Reduce waste, increase income, and feed more families",
      img: img1,
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
            {isBn ? 'HarvestGuard কীভাবে কাজ করে' : 'How HarvestGuard Works'}
          </h2>
          <p className="text-[#226343] opacity-80 mt-2 text-sm">
            {isBn ? 'আমাদের ফসল রক্ষার চারটি সহজ ধাপ' : 'Four simple steps to save our harvest'}
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
            isBn ? '✔️ ফসল সঞ্চয়ের ৬০% উল্লেখযোগ্য হ্রাস' : '✔️ 60% Reduction in Post-Harvest Losses',
            isBn ? '✔️ রিয়েল-টাইম পর্যবেক্ষণ ও সতর্কতা' : '✔️ Real-Time Monitoring & Alerts',
            isBn ? '✔️ এআই-চালিত ফসল স্বাস্থ্য বিশ্লেষণ' : '✔️ AI-Powered Crop Health Analysis',
            isBn ? '✔️ কৃষকের আয় ৪০% বৃদ্ধি' : '✔️ Increased Farmer Income by 40%',
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
            <HowItWorksStep
              key={step.id}
              {...step}
              title={isBn ? (
                step.id === 1 ? 'ডেটা সংগ্রহ' : step.id === 2 ? 'স্মার্ট সতর্কতা' : step.id === 3 ? 'কার্যকর ব্যবস্থা' : 'খাদ্য সংরক্ষণ'
              ) : step.title}
              desc={isBn ? (
                step.id === 1 ? 'রিয়েল-টাইমে সংরক্ষণ অবস্থান, তাপমাত্রা ও আর্দ্রতা পর্যবেক্ষণ' : step.id === 2 ? 'যখন শর্ত ক্ষতির ঝুঁকি সৃষ্টি করে তখন তাৎক্ষণিক এলার্ট পান' : step.id === 3 ? 'ক্ষয় রোধে গাইড করা ধাপগুলি অনুসরণ করুন' : 'বর্জ্য কমান, আয় বাড়ান এবং আরও পরিবারকে খাদ্য সরবরাহ করুন'
              ) : step.desc}
            />
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
            {isBn ? 'কীভাবে কাজ করে' : 'How It Works'}
          </h3>

          <div className="flex justify-center items-center gap-6 text-[15px] font-semibold text-white">

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              {isBn ? 'ডেটা' : 'Data'}
            </div>

            <div className="text-[#0fa451] text-2xl">→</div>

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              {isBn ? 'সতর্কতা' : 'Warning'}
            </div>

            <div className="text-[#0fa451] text-2xl">→</div>

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              {isBn ? 'কর্ম' : 'Action'}
            </div>

            <div className="text-[#0fa451] text-2xl">→</div>

            <div className="bg-[#0fa451] px-5 py-2 rounded-full shadow">
              {isBn ? 'সংরক্ষিত খাদ্য' : 'Saved Food'}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
