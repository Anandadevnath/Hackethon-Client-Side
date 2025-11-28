import React, { useState, useEffect } from "react";
import { useLanguage } from '../context/LanguageContext';
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { motion } from "framer-motion";

// Stable Bangladesh District GeoJSON API
const GEO_API =
  "https://raw.githubusercontent.com/ratulbasak/bangladesh-geojson/master/bd-districts.json";

// Dummy crisis data
const crisisData = {
  Chattogram: 74,
  Dhaka: 65,
  Sylhet: 58,
  Rajshahi: 42,
  Khulna: 38,
  Barisal: 49,
  Rangpur: 31,
  Mymensingh: 55,
};

// GLOBAL FADE VARIANT
const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CrisisSection() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [geoData, setGeoData] = useState(null);

  // Fetch GeoJSON manually to bypass CORS
  useEffect(() => {
    async function loadMap() {
      try {
        const res = await fetch(GEO_API);
        const json = await res.json();
        setGeoData(json);
      } catch (err) {
        console.error("MAP LOAD ERROR:", err);
      }
    }
    loadMap();
  }, []);

  return (
    <section className="bg-[linear-gradient(180deg,#fff6f4_0%,#ffefe5_100%)] py-16 px-4">

      <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1fr_450px] gap-12 items-start">

        {/* LEFT CONTENT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 rounded-xl bg-[rgba(255,80,60,0.10)] 
            text-[#ff3b2e] flex items-center justify-center text-2xl 
            shadow-[0_15px_35px_rgba(255,100,80,0.12)]"
          >
            ⚠️
          </motion.div>

          <h2 className="text-3xl mt-5 mb-4 text-[#7d1414] font-extrabold">
            {isBn ? 'আমরা যে সংকটটির সম্মুখীন' : 'The Crisis We Face'}
          </h2>

          <p className="text-[#8c2a2a] max-w-[520px] mb-5 leading-relaxed">
            {isBn ? 'বাংলাদেশ প্রতিবছর খাদ্যভাণ্ডার থেকে কোটি কোটি টাকা হারায়। এটি কেবল সংখ্যা নয়—এটি বাস্তব ক্ষুধা, নষ্ট হওয়া সম্পদ, এবং ভাঙা স্বপ্ন।' : 'Bangladesh loses billions in food every year. This isn\'t just numbers—it\'s real hunger, wasted resources, and broken dreams.'}
          </p>

          <ul className="text-[#6b3b2b] space-y-3 leading-relaxed text-[15px]">
            <li className="flex gap-2">
              <span className="text-red-500 text-xl">•</span>
              ফসল সংগ্রহের পরবর্তী ক্ষতি ধান, গম এবং সবজি‌তে সবচেয়ে বেশি প্রভাব ফেলে
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 text-xl">•</span>
              অপর্যাপ্ত সংরক্ষণ সুবিধা এবং দুর্বল অবকাঠামো প্রধান কারণ
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 text-xl">•</span>
              জলবায়ু পরিবর্তন ও অনিশ্চিত আবহাওয়া পরিস্থিতি আরও বাড়ায়
            </li>
          </ul>
        </motion.div>

        {/* RIGHT MAP */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl p-6 shadow-[0_28px_60px_rgba(12,40,20,0.08)]"
        >
          <h3 className="text-[#b32929] font-bold mb-1 text-lg">
            {isBn ? 'খাদ্য ক্ষতির ঝুঁকির মানচিত্র' : 'Food Loss Risk Map'}
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            {isBn ? 'জেলা নির্বাচন করে সংকট তথ্য দেখুন' : 'Click a district to view crisis data'}
          </p>

          <div className="bg-[#e8f3ff] rounded-xl p-4 h-[340px] flex items-center justify-center">
            {!geoData ? (
              <p>Loading map...</p>
            ) : (
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 3500, center: [90.5, 24] }}
                width={400}
                height={370}
              >
                <Geographies geography={geoData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const district = geo.properties.NAME_2;
                      const crisis = crisisData[district] ?? 20;

                      const fillColor =
                        crisis > 65
                          ? "#ff4e4e"
                          : crisis > 45
                          ? "#ffb347"
                          : "#6cd66c";

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => setSelectedDistrict(district)}
                          style={{
                            default: {
                              fill: fillColor,
                              outline: "none",
                              transition: "all 0.25s ease-in-out",
                            },
                            hover: {
                              fill: "#37a95a",
                              cursor: "pointer",
                              outline: "none",
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            )}
          </div>

          {/* LEGEND */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 mt-5 justify-center"
          >
            <span className="px-4 py-1 rounded-full bg-[#ffe1e1] text-[#d43b3b] text-sm shadow">
              {isBn ? 'উচ্চ ঝুঁকি' : 'High Risk'}
            </span>
            <span className="px-4 py-1 rounded-full bg-[#ffe9d4] text-[#f08d2e] text-sm shadow">
              {isBn ? 'মধ্যম ঝুঁকি' : 'Medium Risk'}
            </span>
            <span className="px-4 py-1 rounded-full bg-[#ddf6e7] text-[#2ea85f] text-sm shadow">
              {isBn ? 'নিম্ন ঝুঁকি' : 'Low Risk'}
            </span>
          </motion.div>

          {selectedDistrict && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-[#c82222] font-semibold mt-5"
            >
              {selectedDistrict}: {crisisData[selectedDistrict] || 20}% Crisis Level
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* BOTTOM CARDS */}
      <div className="max-w-[1220px] mx-auto mt-14 grid md:grid-cols-3 gap-7 px-3">
        {[
          { icon: "📉", number: "0.0M", label: isBn ? 'বার্ষিক হারানো টন' : 'Metric Tonnes Lost Annually' },
          { icon: "💲", number: "$0.0B", label: isBn ? 'বার্ষিক অর্থনৈতিক ক্ষতি' : 'Economic Loss Per Year' },
          { icon: "⚠️", number: "0M+", label: isBn ? 'খাদ্য অনিরাপত্তার মুখে থাকা মানুষ' : 'People Facing Food Insecurity' },
        ].map((card, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ scale: 1.04 }}
            className="bg-white rounded-xl p-6 shadow-[0_18px_36px_rgba(31,37,46,0.06)] flex gap-4 items-center"
          >
            <div className="w-16 h-16 rounded-lg bg-gradient-to-b from-[#ff8a5b] to-[#ff5a3b] text-white flex items-center justify-center text-2xl">
              {card.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-[#2b343a]">
                {card.number}
              </div>
              <div className="text-sm text-[#7a8589]">{card.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LOSS EFFECT TEXT (NEW) */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-[900px] mx-auto mt-14 bg-white/60 backdrop-blur-md 
                   text-center p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
      >
        <p className="text-[#7a3b3b] leading-relaxed text-[15px]">
          These losses affect farmers, families, and our environment—
          contributing to food insecurity and economic waste across the nation.
        </p>
      </motion.div>

    </section>
  );
}
