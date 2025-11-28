import React from 'react';

export default function CallToAction(){
  return (
    <section className="bg-[linear-gradient(180deg,#069a5a_0%,#0b8f5b_60%,#0a8b5a_100%)] text-white py-16 px-4 relative overflow-hidden">
      <div className="max-w-[1180px] mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Be Part of the Solution</h2>
        <p className="opacity-95 mb-5">Join farmers, distributors, and communities across Bangladesh in fighting food loss</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
          <button className="rounded-[28px] px-6 py-3 font-bold bg-white text-[#0a7a44] shadow-[0_18px_40px_rgba(0,0,0,0.12)] inline-flex items-center">Get Started Now <span className="ml-2">→</span></button>
          <button className="rounded-[28px] px-5 py-3 font-bold bg-transparent text-white border border-white/30">Learn More</button>
        </div>

        <hr className="w-3/5 border-0 h-[1px] bg-[rgba(255,255,255,0.15)] mx-auto my-5" />

        <p className="text-[rgba(255,255,255,0.9)] mb-4">Together, we can achieve SDG 12.3 and halve food loss by 2030</p>

        <div className="inline-flex items-center gap-3 bg-white/12 rounded-full px-4 py-2 mt-1 -mb-1">
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#0a8b5a]">🎯</div>
          <div className="text-left text-[13px]">Supporting<br/><strong>SDG 12.3</strong></div>
        </div>
      </div>
    </section>
  );
}
