import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function StatsSection(){
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  return (
    <section className="bg-[linear-gradient(180deg,#eafff1_0%,#5eff96_100%)] text-[#064e3b] py-8 px-4 shadow-[inset_0_8px_40px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 items-center text-center py-6 px-3">
        <div>
          <div className="text-3xl md:text-4xl font-bold mb-1">4.5M</div>
          <div className="text-sm opacity-95">{isBn ? 'সংরক্ষিত টন' : 'Tonnes Saved'}</div>
          <div className="text-xs opacity-75 mt-1">{isBn ? 'বার্ষিক লক্ষ্য' : 'Annual Target'}</div>
        </div>

        <div>
          <div className="text-3xl md:text-4xl font-bold mb-1">$1.5B</div>
          <div className="text-sm opacity-95">{isBn ? 'অর্থনৈতিক মূল্য' : 'Economic Value'}</div>
          <div className="text-xs opacity-75 mt-1">{isBn ? 'প্রতিবছর সুরক্ষিত' : 'Protected Annually'}</div>
        </div>

        <div>
          <div className="text-3xl md:text-4xl font-bold mb-1">10K+</div>
          <div className="text-sm opacity-95">{isBn ? 'সাহায্যপ্রাপ্ত কৃষক' : 'Farmers Helped'}</div>
          <div className="text-xs opacity-75 mt-1">{isBn ? 'এবং বাড়ছে' : 'And Growing'}</div>
        </div>
      </div>
    </section>
  );
}
