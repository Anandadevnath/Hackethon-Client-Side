import { motion } from "framer-motion";
import logoEn from "../assets/harvest-en-removebg-preview.png";
import logoBn from "../assets/harvest-bn-removebg-preview.png";
import { useLanguage } from '../context/LanguageContext';
import { FooterSection } from './common/FooterSection';

export default function Footer() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  return (
    <footer className="relative bg-[linear-gradient(180deg,#094f32_0%,#053d2b_100%)] text-[#e6ffe6] pt-12 pb-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-16 w-72 h-72 bg-[#0af58a33] blur-[140px] rounded-full"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-[#0ace6a22] blur-[130px] rounded-full"></div>
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between gap-16 relative px-4">

        {/* BRAND COLUMN — responsive on very small screens */}
        <div className="flex-1 w-full md:min-w-[300px] min-w-0">

          {/* Large Logo */}
          <motion.img
            whileHover={{ scale: 1.04 }}
            src={isBn ? logoBn : logoEn}
            alt="HarvestGuard"
            className="w-28 h-28 md:w-40 md:h-40 object-contain mb-0 drop-shadow-lg max-w-full"
          />

          {/* Description */}
          <p className="text-lg leading-relaxed max-w-[360px] mb-6">
            {isBn ? 'কৃষকেরাদের খাদ্য নষ্ট কমাতে, ফসল রক্ষা করতে এবং প্রতিটি পরিবারের খাদ্য সুরক্ষা নিশ্চিত করতে স্মার্ট প্রযুক্তি দিয়ে সক্ষম করা।' : 'Empowering Bangladeshi farmers with smart technology to reduce food waste, protect harvests, and ensure food security for every family.'}
          </p>

          {/* Contact Info */}
          <div className="text-base space-y-2 mb-6">
            <div>📍 Dhaka, Bangladesh</div>
            <div>📞 +880 1XXX-XXXXXX</div>
            <div>✉️ support@harvestguard.bd</div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 flex-wrap">
            {["\uf09a", "\uf099", "\uf16d", "\uf167"].map((icon, i) => (
              <motion.a
                key={i}
                whileHover={{ scale: 1.12, rotate: 3 }}
                className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center 
                text-[#fffbe6] text-lg shadow-[0_3px_8px_rgba(0,0,0,0.25)]"
                href="#"
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* LINKS COLUMN */}
        <div className="flex-1 w-full md:min-w-[280px] min-w-0 flex flex-col md:flex-row md:justify-between gap-6 md:gap-12">
          <FooterSection title={isBn ? 'দ্রুত লিঙ্ক' : 'Quick Links'} items={isBn ? ["হোম", "আমাদের সম্পর্কে", "ড্যাশবোর্ড", "লগইন"] : ["Home", "About", "Dashboard", "Login"]} />
          <FooterSection title={isBn ? 'সম্পদ' : 'Resources'} items={isBn ? ["প্রশিক্ষণ ভিডিও", "সাহায্য কেন্দ্র", "প্রশ্নাবলি", "কমিউনিটি ফোরাম"] : ["Training Videos", "Help Center", "FAQs", "Community Forum"]} />
          <FooterSection title={isBn ? 'আইনি' : 'Legal'} items={isBn ? ["গোপনীয়তা নীতি", "পরিষেবা শর্ত", "ডেটা নিরাপত্তা"] : ["Privacy Policy", "Terms of Service", "Data Security"]} />

          <FooterSection title="Partners">
            <div className="flex flex-col gap-2">
              {["DAE", "FAO", "UNDP"].map((p, i) => (
                <motion.button key={i} whileHover={{ scale: 1.1 }} className="bg-white/10 text-[#fffbe6] border border-white/20 rounded px-3 py-1 text-sm">
                  {p}
                </motion.button>
              ))}
            </div>
          </FooterSection>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20 mt-10"></div>

      {/* Bottom Row */}
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-4 px-4 py-5">

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          © 2025 HarvestGuard. All rights reserved.
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex items-center gap-3 bg-white/10 rounded-full px-5 py-2 text-[#fffbe6] border border-white/20 
          shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
        >
          <span className="text-lg">🎯</span>
          <span>SDG 12.3</span>
          <a className="ml-2 hover:text-[#0af58a]" href="#">Learn More ↗</a>
        </motion.div>
      </div>
    </footer>
  );
}
