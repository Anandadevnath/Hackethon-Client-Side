import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import logoEn from "../assets/harvest-en-removebg-preview.png";
import logoBn from "../assets/harvest-bn-removebg-preview.png";
import { useLanguage } from '../context/LanguageContext';
import { FooterSection } from './common/FooterSection';

export default function Footer() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  return (
    <footer className="relative bg-[#053d2b] text-[#e6ffe6] pt-20 pb-12 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">

          {/* BRAND COLUMN */}
          <div className="col-span-1 lg:col-span-2">
            <motion.img
              whileHover={{ scale: 1.04 }}
              src={isBn ? logoBn : logoEn}
              alt="HarvestGuard"
              className="h-12 md:h-16 max-w-[140px] md:max-w-[180px] object-contain mb-6"
            />
            <p className="text-sm leading-relaxed text-[#c0e0c0] mb-8 max-w-xs">
              {isBn ? 'কৃষকেরাদের খাদ্য নষ্ট কমাতে, ফসল রক্ষা করতে এবং প্রতিটি পরিবারের খাদ্য সুরক্ষা নিশ্চিত করতে স্মার্ট প্রযুক্তি দিয়ে সক্ষম করা।' : 'Empowering farmers with smart technology to reduce food waste, protect harvests, and ensure food security for every family.'}
            </p>

            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} className="w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#0af58a] hover:text-[#053d2b] transition-all" href="#">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS COLUMNS */}
          <FooterSection title={isBn ? 'দ্রুত লিঙ্ক' : 'Quick Links'} items={isBn ? ["হোম", "আমাদের সম্পর্কে", "ড্যাশবোর্ড", "লগইন"] : ["Home", "About", "Dashboard", "Login"]} />
          <FooterSection title={isBn ? 'সম্পদ' : 'Resources'} items={isBn ? ["প্রশিক্ষণ ভিডিও", "সাহায্য কেন্দ্র", "প্রশ্নাবলি", "কমিউনিটি ফোরাম"] : ["Training Videos", "Help Center", "FAQs", "Community Forum"]} />
          <FooterSection title={isBn ? 'আইনি' : 'Legal'} items={isBn ? ["গোপনীয়তা নীতি", "পরিষেবা শর্ত", "ডেটা নিরাপত্তা"] : ["Privacy Policy", "Terms of Service", "Data Security"]} />
        </div>

        {/* BOTTOM SECTION */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-xs text-[#a0c0a0]">
          <div className="md:col-span-3">© 2025 HarvestGuard. All rights reserved.</div>

          <div className="md:col-span-6 flex flex-wrap gap-4 justify-center text-[#c0e0c0]">
             <div className="flex items-center gap-1.5"><MapPin size={14} /> Dhaka, Bangladesh</div>
             <div className="flex items-center gap-1.5"><Phone size={14} /> +880 16123</div>
             <div className="flex items-center gap-1.5"><Mail size={14} /> support@harvestguard.bd</div>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-xs">
              <span>🎯 SDG 12.3</span>
              <a className="hover:text-[#0af58a] transition-colors" href="#">Learn More ↗</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}