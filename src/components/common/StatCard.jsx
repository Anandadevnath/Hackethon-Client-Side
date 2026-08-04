import React from 'react';

export const StatCard = ({ icon, number, label, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 cursor-pointer hover:shadow-lg transition-shadow">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#ff8a5b] to-[#ff4c2e] flex items-center justify-center text-xl text-white shadow-sm">
      {icon}
    </div>
    <div>
      <div className="text-lg md:text-2xl font-extrabold text-[#222]">{number}</div>
      <div className="text-[10px] md:text-xs text-[#6b7578]">{label}</div>
    </div>
  </div>
);
