import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import districtCenters from "../data/district-centers";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";

// Fade-Up Variant
const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Float Animation
const float = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
  }
};

export default function CrisisSection() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const mapRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    // Wait for Leaflet to be loaded via CDN (global `L`)
    const L = window.L;
    if (!L) return;

    // Determine map center from user's registered location if available
    let center = { lat: 23.8103, lng: 90.4125 }; // default Dhaka
    try {
      const loc = user?.location;
      if (loc && (loc.district || loc.division)) {
        const key = loc.district || loc.division;
        if (districtCenters[key]) {
          center = districtCenters[key];
        }
      }
    } catch (e) { /* ignore and fallback to default */ }

    // initialize map
    const map = L.map('local-risk-map', { zoomControl: true, touchZoom: true }).setView([center.lat, center.lng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Utility: Bangla numerals conversion
    const toBanglaDigits = (num) => String(num).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

    // Risk mapping
    const riskLevels = ['Low', 'Medium', 'High'];
    const riskBn = { Low: 'নিম্ন', Medium: 'মধ্যম', High: 'উচ্চ' };
    const riskColor = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444' };

    // Crop types in Bangla
    const cropsBn = ['ধান', 'গম', 'সবজি', 'আখ', 'ফল'];

    // Generate mock neighbor points within district (random offsets)
    const generateMockPoints = (count = 12) => {
      const points = [];
      for (let i = 0; i < count; i++) {
        // random offset within ~0.04 degrees (~4-5km)
        const lat = center.lat + (Math.random() - 0.5) * 0.08;
        const lng = center.lng + (Math.random() - 0.5) * 0.08;
        const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        const crop = cropsBn[Math.floor(Math.random() * cropsBn.length)];
        const hoursAgo = Math.floor(Math.random() * 72); // up to 3 days
        points.push({ lat, lng, risk, crop, hoursAgo });
      }
      return points;
    };

    const neighbors = generateMockPoints(Math.floor(10 + Math.random() * 6));

    // Farmer's registered location: if user provided precise lat/lng, use them; otherwise use district center
    const farmer = (user && user.location && user.location.lat && user.location.lng)
      ? { lat: Number(user.location.lat), lng: Number(user.location.lng) }
      : { lat: center.lat, lng: center.lng };

    // Farmer marker (distinct blue)
    const farmerMarker = L.circleMarker([farmer.lat, farmer.lng], {
      radius: 9,
      color: '#2563eb',
      fillColor: '#2563eb',
      fillOpacity: 0.95,
      weight: 2
    }).addTo(map).bindPopup(isBn ? '<b>আপনি</b><br/>ফসল: পর্যালোচনা করুন' : '<b>You</b>');

    // Add anonymous neighbor markers
    neighbors.forEach(n => {
      const circle = L.circleMarker([n.lat, n.lng], {
        radius: 8,
        color: riskColor[n.risk],
        fillColor: riskColor[n.risk],
        fillOpacity: 0.9,
        weight: 1
      }).addTo(map);

      const hoursBn = toBanglaDigits(n.hoursAgo);
      const popupHtml = `ফসল : ${n.crop}<br/>ঝুঁকি : ${riskBn[n.risk]}<br/>শেষ আপডেট : ${hoursBn} ঘন্টা আগে`;
      circle.bindPopup(popupHtml);
    });

    mapRef.current = map;

    // Cleanup
    return () => {
      try { map.remove(); } catch (e) { }
    };
  }, [isBn]);

  return (
    <section
      className="
      bg-[radial-gradient(circle_at_top,#fff7f4,#ffe8df,#ffd7ca)]
      py-20 px-5
    "
    >
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-1 gap-12 items-start">

        {/* LEFT / MAIN CONTENT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Floating Warning Icon */}
          <motion.div
            variants={float}
            animate="animate"
            className="
              w-20 h-20 rounded-2xl
              bg-[rgba(255,60,60,0.12)]
              text-[#ff2e2e]
              flex items-center justify-center
              text-4xl
              shadow-[0_20px_40px_rgba(255,80,60,0.15)]
            "
          >
            ⚠️
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl mt-6 mb-4 text-[#6e0d0d] font-extrabold tracking-tight">
            {isBn ? "আমরা যে সংকটে আছি" : "The Crisis We Face"}
          </h2>

          {/* Description */}
          <p className="text-[#7a2626] text-[17px] max-w-[550px] mb-6 leading-relaxed">
            {isBn
              ? "বাংলাদেশ প্রতিবছর খাদ্য ব্যবস্থায় কোটি কোটি টাকার ক্ষতির মুখে পড়ে। এটি শুধু পরিসংখ্যান নয়—এটি বাস্তব ক্ষুধা, নষ্ট হওয়া সম্পদ এবং দুঃখজনক সামাজিক প্রভাব।"
              : "Bangladesh loses billions of taka in food every year. This is not just data—it is real hunger, wasted resources, and serious social impact."}
          </p>

          {/* Bullet Points */}
          <ul className="text-[#5a3b2b] space-y-3 leading-relaxed text-[16px]">
            {isBn ? (
              <>
                <li className="flex gap-2"><span className="text-red-500 text-xl">•</span> ফসল সংগ্রহের পরবর্তী ক্ষতি ধান, গম এবং সবজিতে বেশি</li>
                <li className="flex gap-2"><span className="text-red-500 text-xl">•</span> অপর্যাপ্ত সংরক্ষণ সুবিধা ও দুর্বল অবকাঠামো প্রধান কারণ</li>
                <li className="flex gap-2"><span className="text-red-500 text-xl">•</span> জলবায়ু পরিবর্তনের অস্থিরতা ক্ষতির হার আরও বাড়ায়</li>
              </>
            ) : (
              <>
                <li className="flex gap-2"><span className="text-red-500 text-xl">•</span> Post-harvest losses severely impact rice, wheat and vegetables</li>
                <li className="flex gap-2"><span className="text-red-500 text-xl">•</span> Poor storage facilities and outdated infrastructure worsen loss</li>
                <li className="flex gap-2"><span className="text-red-500 text-xl">•</span> Climate volatility increases the risk of spoilage</li>
              </>
            )}
          </ul>
        </motion.div>
      </div>

      {/* BOTTOM STAT CARDS */}
      <div className="max-w-[1220px] mx-auto mt-20 grid md:grid-cols-3 gap-7 px-3">

        {[
          {
            icon: "📉",
            number: isBn ? "৪.৫M" : "4.5M",
            labelBn: "বার্ষিক হারানো টন",
            labelEn: "Metric Tonnes Lost Annually"
          },
          {
            icon: "💲",
            number: isBn ? "$১.৫B" : "$1.5B",
            labelBn: "বার্ষিক অর্থনৈতিক ক্ষতি",
            labelEn: "Economic Loss Per Year"
          },
          {
            icon: "⚠️",
            number: isBn ? "৩৮M+" : "38M+",
            labelBn: "খাদ্য অনিরাপত্তায় থাকা মানুষ",
            labelEn: "People Facing Food Insecurity"
          }
        ].map((card, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ scale: 1.06, transition: { duration: 0.25 } }}
            className="
              bg-white rounded-2xl p-7
              shadow-[0_20px_45px_rgba(0,0,0,0.06)]
              flex gap-5 items-center
              transition-all
            "
          >
            {/* Icon */}
            <div className="
              w-20 h-20 rounded-xl
              bg-gradient-to-b from-[#ff8a5b] to-[#ff4c2e]
              flex items-center justify-center text-3xl text-white shadow-lg
            ">
              {card.icon}
            </div>

            {/* Text */}
            <div>
              <div className="text-3xl font-extrabold text-[#2e3338]">
                {card.number}
              </div>
              <div className="text-sm text-[#7a8589]">
                {isBn ? card.labelBn : card.labelEn}
              </div>
            </div>
          </motion.div>
        ))}

      </div>

      {/* LOSS EFFECT TEXT */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="
          max-w-[900px] mx-auto mt-16
          bg-white/70 backdrop-blur-xl
          text-center p-7 rounded-xl
          shadow-[0_12px_35px_rgba(0,0,0,0.06)]
        "
      >
        <p className="text-[#7a2f2f] leading-relaxed text-[16px]">
          {isBn
            ? "এই ক্ষতিগুলো কৃষকের আয়, পরিবারিক জীবন এবং পরিবেশকে সরাসরি প্রভাবিত করে—ফলে জাতীয় খাদ্য নিরাপত্তা হুমকির মুখে পড়ে।"
            : "These losses directly affect farmers’ income, household stability, and the environment—pushing national food security at risk."}
        </p>
      </motion.div>

      {/* Local Risk Map */}
      <div className="max-w-[1220px] mx-auto mt-10 px-3">
        <h3 className="text-2xl font-bold text-[#6e0d0d] mb-4">{isBn ? 'স্থানীয় ঝুঁকি মানচিত্র' : 'Local Risk Map'}</h3>
        <div id="local-risk-map" style={{ width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden' }} />
        <div className="mt-3 text-sm text-[#546168]">{isBn ? 'নীল পিন: আপনার অবস্থান — অন্যান্য পয়েন্টগুলো সম্পূর্ণ স্বনামের থাকছে।' : 'Blue pin: your location — neighbors shown anonymously.'}</div>
      </div>
    </section>
  );
}
