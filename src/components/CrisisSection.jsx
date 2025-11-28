import React from 'react';

export default function CrisisSection(){
  return (
    <section className="bg-[linear-gradient(180deg,#fff6f4_0%,#fff1e8_100%)] py-16 px-4">
      <div className="max-w-[1180px] mx-auto grid md:grid-cols-[1fr_420px] gap-9 items-start">
        <div className="pt-1">
          <div className="w-14 h-14 rounded-lg bg-[rgba(255,80,60,0.08)] text-[#ff3b2e] flex items-center justify-center text-lg shadow-[0_12px_30px_rgba(255,100,80,0.08)]">⚠️</div>
          <h2 className="text-3xl mt-4 mb-3 text-[#7d1414] font-extrabold">The Crisis We Face</h2>
          <p className="text-[#8c2a2a] max-w-[520px] mb-4">Bangladesh loses billions in food every year. This isn't just numbers—it's real hunger, wasted resources, and broken dreams.</p>

          <ul className="mt-2 text-[#6b3b2b] list-none pl-5">
            <li className="mb-2 relative pl-5">ফসল সংগ্রহের পরবর্তী ক্ষতি ধান, গম এবং সবজি‌তে সবচেয়ে বেশি প্রভাব ফেলে</li>
            <li className="mb-2 relative pl-5">অপর্যাপ্ত সংরক্ষণ সুবিধা এবং দুর্বল অবকাঠামো প্রধান কারণ</li>
            <li className="mb-2 relative pl-5">জলবায়ু পরিবর্তন ও অনিশ্চিত আবহাওয়া পরিস্থিতি আরও বাড়ায়</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <div className="w-full bg-white rounded-[16px] p-5 shadow-[0_30px_60px_rgba(12,40,20,0.08)]">
            <div className="font-bold text-[#b32929] mb-3">Food Loss Risk Map</div>
            <div className="bg-[linear-gradient(180deg,#e8f6ff,#f5fbff)] rounded-md p-4 flex items-center justify-center">
              <div className="w-[220px] h-[180px] rounded-md bg-[#dfeff7] flex items-center justify-center text-[#225a73] font-bold">Map</div>
            </div>
            <div className="flex gap-3 mt-4">
              <span className="px-3 py-2 rounded-full bg-white shadow-[0_6px_18px_rgba(13,42,32,0.05)] text-sm text-[#d43b3b]">High Risk</span>
              <span className="px-3 py-2 rounded-full bg-white shadow-[0_6px_18px_rgba(13,42,32,0.05)] text-sm text-[#f08d2e]">Medium Risk</span>
              <span className="px-3 py-2 rounded-full bg-white shadow-[0_6px_18px_rgba(13,42,32,0.05)] text-sm text-[#2ea85f]">Low Risk</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto mt-8 grid md:grid-cols-3 gap-5 px-4">
        <div className="bg-white rounded-lg p-6 shadow-[0_18px_36px_rgba(31,37,46,0.06)] flex gap-4 items-center">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-b from-[#ff8a5b] to-[#ff5a3b] text-white flex items-center justify-center text-lg">📉</div>
          <div>
            <div className="text-2xl font-bold text-[#2b343a]">0.0M</div>
            <div className="text-sm text-[#7a8589]">Metric Tonnes Lost Annually</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-[0_18px_36px_rgba(31,37,46,0.06)] flex gap-4 items-center">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-b from-[#ff8a5b] to-[#ff5a3b] text-white flex items-center justify-center text-lg">💲</div>
          <div>
            <div className="text-2xl font-bold text-[#2b343a]">$0.0B</div>
            <div className="text-sm text-[#7a8589]">Economic Loss Per Year</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-[0_18px_36px_rgba(31,37,46,0.06)] flex gap-4 items-center">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-b from-[#ff8a5b] to-[#ff5a3b] text-white flex items-center justify-center text-lg">⚠️</div>
          <div>
            <div className="text-2xl font-bold text-[#2b343a]">0M+</div>
            <div className="text-sm text-[#7a8589]">People Facing Food Insecurity</div>
          </div>
        </div>
      </div>
    </section>
  );
}
