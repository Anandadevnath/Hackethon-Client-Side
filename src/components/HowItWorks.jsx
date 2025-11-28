import React from 'react';

export default function HowItWorks(){
  const steps = [
    {
      id: 1,
      title: 'Data Collection',
      desc: 'Monitor storage conditions, temperature, and humidity in real-time',
      img: 'https://images.unsplash.com/photo-1503342217505-b0a15d3b6a8f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d'
    },
    {
      id: 2,
      title: 'Smart Warnings',
      desc: 'Get instant alerts when conditions threaten your stored grains',
      img: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e'
    },
    {
      id: 3,
      title: 'Take Action',
      desc: 'Follow guided steps to prevent spoilage and loss',
      img: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=8c7b6a5d4e3f2a1b0c9d8e7f6a5b4c3d'
    },
    {
      id: 4,
      title: 'Save Food',
      desc: 'Reduce waste, increase income, and feed more families',
      img: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6'
    }
  ];

  return (
    <section className="bg-[linear-gradient(180deg,#f3fff8_0%,#ecfff4_100%)] py-16 px-4">
      <div className="max-w-[1180px] mx-auto">
        <div className="text-center mb-4">
          <div className="inline-flex w-18 h-18 rounded-full items-center justify-center bg-[#eaffef] text-[#028a3e] text-2xl shadow-[0_12px_30px_rgba(2,138,62,0.06)]">✔️</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a6136] mt-4 mb-2">How HarvestGuard Works</h2>
          <p className="text-[#2c6b4a] opacity-80">Four simple steps to save our harvest</p>
        </div>

        <div className="flex gap-3 justify-center flex-wrap my-6">
          <span className="bg-white rounded-lg px-4 py-3 shadow-[0_8px_20px_rgba(3,120,64,0.06)] text-[#0a6b3a] font-semibold text-sm">60% Reduction in Post-Harvest Losses</span>
          <span className="bg-white rounded-lg px-4 py-3 shadow-[0_8px_20px_rgba(3,120,64,0.06)] text-[#0a6b3a] font-semibold text-sm">Real-Time Monitoring &amp; Alerts</span>
          <span className="bg-white rounded-lg px-4 py-3 shadow-[0_8px_20px_rgba(3,120,64,0.06)] text-[#0a6b3a] font-semibold text-sm">AI-Powered Crop Health Analysis</span>
          <span className="bg-white rounded-lg px-4 py-3 shadow-[0_8px_20px_rgba(3,120,64,0.06)] text-[#0a6b3a] font-semibold text-sm">Increased Farmer Income by 40%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(step => (
            <article key={step.id} className="bg-white rounded-lg overflow-hidden shadow-[0_22px_50px_rgba(3,50,30,0.06)]">
              <div className="h-40 bg-cover bg-center relative" style={{backgroundImage:`url(${step.img})`}}>
                <div className="absolute right-2 top-2 w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold shadow-[0_8px_20px_rgba(3,50,30,0.08)]">{step.id}</div>
              </div>
              <div className="p-4 md:p-5">
                <h3 className="text-lg font-extrabold mb-2">{step.title}</h3>
                <p className="text-[#697a6f] text-sm leading-6">{step.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
