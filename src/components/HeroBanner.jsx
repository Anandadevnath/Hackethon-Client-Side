import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import logoEn from '../assets/harvest-en-removebg-preview.png';
import logoBn from '../assets/harvest-bn-removebg-preview.png';

export default function HeroBanner() {
  const bgImage = "linear-gradient(180deg, rgba(2, 20, 12, 0.35), rgba(4, 10, 6, 0.55)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f')";

  const { lang } = useLanguage();

  const isBn = lang === 'bn';

  return (
    <section className="relative min-h-[70vh] sm:min-h-[85vh] md:min-h-[98vh] flex items-center text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center saturate-[0.95] brightness-[0.7] z-0"
        style={{ backgroundImage: bgImage }}
      />

      <div className="relative z-10 w-full max-w-[1360px] mx-auto grid gap-9 px-4 py-24 items-center md:grid-cols-2">
        <motion.div
          className="text-white"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="">
            <img src={isBn ? logoBn : logoEn} alt="Harvest logo" className="w-64 h-30 rounded-lg object-contain bg-white/0" />
          </motion.div>

          <motion.h1 className="mt-6 mb-5 font-extrabold text-4xl sm:text-5xl md:text-[48px] lg:text-[56px] leading-[1.03] tracking-[-0.8px] text-white" style={{ textShadow: '0 6px 18px rgba(3,10,6,0.35)' }} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            {isBn ? (
              <>
                আপনার কৃষি যাত্রায়
                <br />
                নতুনত্ব নিয়ে আসছি。
              </>
            ) : (
              <>
                Bringing Innovation to
                <br />
                Your Farming Journey.
              </>
            )}
          </motion.h1>

          <motion.p className="max-w-[640px] text-[rgba(235,249,237,0.95)] mb-7 text-base md:text-lg leading-7" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            {isBn ? (
              'প্রিসিশন কৃষি ও টেকসই অনুশীলনের মাধ্যমে আমরা আপনাকে আরও দক্ষ ও লাভজনকভাবে চাষ করতে সাহায্য করি। কৃষি করার পদ্ধতি বদলাতে আমাদের সঙ্গে যোগ দিন।'
            ) : (
              'From precision agriculture to sustainable practices, we help you grow more efficiently and profitably. Join us in transforming the way you farm.'
            )}
          </motion.p>

          <motion.div className="flex gap-5 items-center" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <button className="py-3 px-6 rounded-[28px] font-bold inline-flex items-center gap-2.5 bg-gradient-to-r from-[#7ef37d] to-[#34c24b] text-[#06260c] shadow-[0_12px_36px_rgba(46,125,50,0.18)]">
              {isBn ? 'শুরু করুন' : 'Get Started'} <span className="font-extrabold">→</span>
            </button>

            <button className="py-3 px-6 rounded-[28px] font-bold inline-flex items-center gap-2.5 bg-white/6 text-white border border-white/12">
              {isBn ? 'আরও জানুন' : 'Learn More'}
            </button>
          </motion.div>
        </motion.div>

        {/* Right-side card removed per design: logo shown above heading instead */}
      </div>
    </section>
  );
}
