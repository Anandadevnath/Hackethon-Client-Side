import React from 'react';

export default function FeaturesSection() {
  return (
    <section className="bg-[linear-gradient(180deg,#f2fff7_0%,#eafef0_100%)] py-14 px-5">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
        <div className="bg-[linear-gradient(180deg,#03984a,#007a33)] text-white rounded-lg p-8 transform -translate-y-1 shadow-[0_32px_40px_rgba(3,120,64,0.18)] text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center bg-white/12 text-white text-2xl">🚜</div>
          <h3 className="text-lg font-bold mb-3">Modern Agriculture Equipment</h3>
          <p className="text-[rgba(255,255,255,0.9)]">Advanced storage and monitoring solutions to reduce post-harvest losses and preserve crop quality.</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-[0_8px_22px_rgba(8,128,56,0.06)] text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center bg-[#eaffef] text-[#0f6d2c] text-2xl">🍃</div>
          <h3 className="text-lg font-bold mb-3 text-[#0b2b23]">Organic and Fresh Harvest</h3>
          <p className="text-[#6b7b73] text-sm leading-6">Real-time crop monitoring ensures optimal harvest timing and maximum nutritional value preservation.</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-[0_8px_22px_rgba(8,128,56,0.06)] text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center bg-[#eaffef] text-[#0f6d2c] text-2xl">👩‍🌾</div>
          <h3 className="text-lg font-bold mb-3 text-[#0b2b23]">Professional & Expert Farmers</h3>
          <p className="text-[#6b7b73] text-sm leading-6">Connect with experienced farmers using data-driven insights and AI-powered recommendations.</p>
        </div>
      </div>
    </section>
  );
}
