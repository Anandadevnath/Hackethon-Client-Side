import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import heroBg from '../assets/bg.png';

export default function HeroBanner() {
  const bgImage = `linear-gradient(180deg, rgba(2, 20, 12, 0.35), rgba(4, 10, 6, 0.55)), url(${heroBg})`;

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
          <div className="mb-4">
            <span className="inline-block bg-[#0b6b3a]/20 text-[#e7fff0] text-sm px-3 py-1 rounded-full font-semibold shadow-[0_4px_14px_rgba(6,40,20,0.06)]">
              {isBn ? 'Sustainable Farming Tech' : 'Sustainable Farming Tech'}
            </span>
          </div>

          <motion.h1 className="mb-5 font-extrabold text-4xl sm:text-5xl md:text-[48px] lg:text-[56px] text-white" style={{ textShadow: '0 6px 18px rgba(3,10,6,0.35)', letterSpacing: '0.6px', lineHeight: '1.08' }} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
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

          <motion.p className="max-w-[640px] text-[rgba(235,249,237,0.95)] mb-7 text-base md:text-lg" style={{ lineHeight: 1.9, letterSpacing: '0.2px' }} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
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

        {/* Right-side info card */}
        <div className="flex items-center justify-end">
          <div className="w-full max-w-[360px]">
            <div className="bg-white/8 backdrop-blur-md rounded-[12px] p-5 shadow-[0_12px_36px_rgba(6,40,20,0.12)] border border-white/10 text-white">
              <div className="text-sm font-semibold mb-2 text-[#eafbf0]">{isBn ? 'আমাদের লক্ষ্য' : 'Our Mission'}</div>
              <div className="text-[14px] leading-6 text-[rgba(235,249,237,0.95)] mb-4">
                {isBn ? (
                  'নতুন ও উদ্ভাবনী সরঞ্জাম ও প্রযুক্তি দিয়ে কৃষকদের ক্ষমতায়ন করা, উৎপাদনশীলতা, টেকসইতা এবং দক্ষতা বাড়ানো।'
                ) : (
                  'To empower farmers with innovative tools and technology that enhance productivity, sustainability, and efficiency.'
                )}
              </div>
              <a className="inline-flex items-center gap-2 text-sm font-semibold bg-white/6 px-3 py-2 rounded-md no-underline text-white" href="/about">
                {isBn ? 'আরও জানুন' : 'Learn More'} <span className="opacity-90">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


