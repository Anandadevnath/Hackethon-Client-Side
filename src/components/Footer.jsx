import React from "react";
import logo from "../assets/react.svg";

const Footer = () => (
  <footer className="bg-[linear-gradient(180deg,#0a6b3c_0%,#075c3c_100%)] text-[#e6ffe6] pt-6 pb-2">
    <div className="max-w-[1200px] mx-auto flex flex-wrap gap-12 items-start px-4">
      <div className="flex-1 min-w-[280px] flex gap-4 items-start">
        <div className="bg-white/5 rounded-2xl px-3 py-2 border border-white/20 flex items-center h-12">
          <img src={logo} alt="HarvestGuard Logo" className="w-9 h-9" />
        </div>
        <div>
          <div className="text-2xl font-semibold text-[#fffbe6] mb-1">HarvestGuard</div>
          <div className="text-base text-[#e6ffe6] max-w-[350px] mb-3">Empowering Bangladeshi farmers with smart technology to reduce food waste, protect harvests, and ensure food security for every family.</div>

          <div className="text-base text-[#e6ffe6] mb-3 space-y-1">
            <div><span role="img" aria-label="location">📍</span> Dhaka, Bangladesh</div>
            <div><span role="img" aria-label="phone">📞</span> +880 1XXX-XXXXXX</div>
            <div><span role="img" aria-label="email">✉️</span> support@harvestguard.bd</div>
          </div>

          <div className="flex gap-2">
            <a href="#" aria-label="Facebook" className="w-9 h-9 bg-white/5 border border-white/20 rounded-lg flex items-center justify-center text-[#fffbe6] text-lg">&#xf09a;</a>
            <a href="#" aria-label="Twitter" className="w-9 h-9 bg-white/5 border border-white/20 rounded-lg flex items-center justify-center text-[#fffbe6] text-lg">&#xf099;</a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 bg-white/5 border border-white/20 rounded-lg flex items-center justify-center text-[#fffbe6] text-lg">&#xf16d;</a>
            <a href="#" aria-label="YouTube" className="w-9 h-9 bg-white/5 border border-white/20 rounded-lg flex items-center justify-center text-[#fffbe6] text-lg">&#xf167;</a>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-[240px] flex gap-12">
        <div>
          <div className="font-bold text-[#fffbe6] mb-2">Quick Links</div>
          <a className="block text-[#e6ffe6] mb-1 hover:text-[#00e68a]" href="#">Home</a>
          <a className="block text-[#e6ffe6] mb-1 hover:text-[#00e68a]" href="#">About</a>
          <a className="block text-[#e6ffe6] mb-1 hover:text-[#00e68a]" href="#">Dashboard</a>
          <a className="block text-[#e6ffe6] mb-1 hover:text-[#00e68a]" href="#">Login</a>
        </div>

        <div>
          <div className="font-bold text-[#fffbe6] mb-2">Resources</div>
          <a className="block text-[#e6ffe6] mb-1 hover:text-[#00e68a]" href="#">Training Videos</a>
          <a className="block text-[#e6ffe6] mb-1 hover:text-[#00e68a]" href="#">Help Center</a>
          <a className="block text-[#e6ffe6] mb-1 hover:text-[#00e68a]" href="#">FAQs</a>
          <a className="block text-[#e6ffe6] mb-1 hover:text-[#00e68a]" href="#">Community Forum</a>
        </div>

        <div>
          <div className="font-bold text-[#fffbe6] mb-2">Legal</div>
          <a className="block text-[#e6ffe6] mb-1 hover:text-[#00e68a]" href="#">Privacy Policy</a>
          <a className="block text-[#e6ffe6] mb-1 hover:text-[#00e68a]" href="#">Terms of Service</a>
          <a className="block text-[#e6ffe6] mb-1 hover:text-[#00e68a]" href="#">Data Security</a>
          <div className="mt-3">
            <div className="text-sm text-[#e6ffe6] mb-2">Partners</div>
            <div className="flex gap-2">
              <button className="bg-white/8 text-[#fffbe6] border border-white/20 rounded px-2 py-1 text-sm">DAE</button>
              <button className="bg-white/8 text-[#fffbe6] border border-white/20 rounded px-2 py-1 text-sm">FAO</button>
              <button className="bg-white/8 text-[#fffbe6] border border-white/20 rounded px-2 py-1 text-sm">UNDP</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-white/15 mt-8"></div>

    <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-4 px-4 py-3">
      <div className="text-base text-[#e6ffe6]">© 2025 HarvestGuard. All rights reserved.</div>
      <div className="flex items-center gap-3 bg-white/7 rounded-full px-4 py-2 text-[#fffbe6] border border-white/18">
        <span className="text-lg">🎯</span>
        <span>SDG 12.3</span>
        <a className="ml-2 text-[#e6ffe6] hover:text-[#00e68a]" href="#" target="_blank" rel="noopener noreferrer">Learn More <span className="ml-1">↗</span></a>
      </div>
    </div>
  </footer>
);

export default Footer;
