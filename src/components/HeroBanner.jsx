import React from 'react';

export default function HeroBanner() {
  const bgImage = "linear-gradient(180deg, rgba(2, 20, 12, 0.35), rgba(4, 10, 6, 0.55)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f')";

  return (
    <section className="relative min-h-[92vh] flex items-center text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center saturate-[0.95] brightness-[0.7] z-0"
        style={{ backgroundImage: bgImage }}
      />

      <div className="relative z-10 w-full max-w-[1410px] mx-auto grid gap-9 px-7 py-24 items-center md:[grid-template-columns:1fr_420px]">
        <div className="text-white">
          <div className="">
            <div className="w-18 h-18 bg-white/95 text-[#26723a] rounded-lg flex items-center justify-center text-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">🌾</div>
          </div>

          <h1 className="mt-6 mb-5 font-extrabold text-4xl sm:text-5xl md:text-[48px] lg:text-[56px] leading-[1.03] tracking-[-0.8px] text-white"
            style={{ textShadow: '0 6px 18px rgba(3,10,6,0.35)' }}>
            Bringing Innovation to
            <br />
            Your Farming Journey.
          </h1>

          <p className="max-w-[640px] text-[rgba(235,249,237,0.95)] mb-7 text-base md:text-lg leading-7">
            From precision agriculture to sustainable practices, we help you grow more
            efficiently and profitably. Join us in transforming the way you farm.
          </p>

          <div className="flex gap-5 items-center">
            <button className="py-3 px-6 rounded-[28px] font-bold inline-flex items-center gap-2.5 bg-gradient-to-r from-[#7ef37d] to-[#34c24b] text-[#06260c] shadow-[0_12px_36px_rgba(46,125,50,0.18)]">
              Get Started <span className="font-extrabold">→</span>
            </button>

            <button className="py-3 px-6 rounded-[28px] font-bold inline-flex items-center gap-2.5 bg-white/6 text-white border border-white/12">
              Learn More
            </button>
          </div>
        </div>

        <div className="flex justify-end items-center md:justify-end sm:justify-start">
          <div className="w-[320px] bg-gradient-to-b from-white/6 to-white/3 rounded-[14px] p-5 text-white backdrop-blur-lg border border-white/8 shadow-[0_12px_36px_rgba(6,20,10,0.35)]">
            <div className="inline-block bg-black/12 text-white/90 font-bold px-3 py-1 rounded-full text-sm mb-3">Our Mission</div>
            <h3 className="text-sm font-bold leading-tight mb-2 text-[#eaf8e9]">To empower farmers with innovative tools and technology that enhance productivity, sustainability, and efficiency.</h3>
            <p className="text-sm text-[rgba(234,248,233,0.9)] mb-3">Learn how we use data and tools to shape the future of farming.</p>
            <a className="text-[#dfffd9] font-bold no-underline" href="#">Learn More →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
