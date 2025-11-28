import React from 'react';

export default function StatsSection(){
  return (
    <section className="bg-[linear-gradient(180deg,#0f4b2f_0%,#0b3f28_100%)] text-[#f7f7ee] py-8 px-4 shadow-[inset_0_8px_40px_rgba(0,0,0,0.15)]">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 items-center text-center py-6 px-3">
        <div>
          <div className="text-3xl md:text-4xl font-bold mb-1">4.5M</div>
          <div className="text-sm opacity-95">Tonnes Saved</div>
          <div className="text-xs opacity-75 mt-1">Annual Target</div>
        </div>

        <div>
          <div className="text-3xl md:text-4xl font-bold mb-1">$1.5B</div>
          <div className="text-sm opacity-95">Economic Value</div>
          <div className="text-xs opacity-75 mt-1">Protected Annually</div>
        </div>

        <div>
          <div className="text-3xl md:text-4xl font-bold mb-1">10K+</div>
          <div className="text-sm opacity-95">Farmers Helped</div>
          <div className="text-xs opacity-75 mt-1">And Growing</div>
        </div>
      </div>
    </section>
  );
}
