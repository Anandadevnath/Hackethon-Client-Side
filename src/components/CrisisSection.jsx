import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import districtCenters from "../data/district-centers";
import { useLanguage } from "../context/LanguageContext";
import { motion, useAnimation } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const float = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

const toBanglaDigits = (num) => String(num).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

export default function CrisisSection() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const { user } = useAuth();
  const controls = useAnimation();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    controls.start("show");

    // Leaflet
    const L = window.L;
    if (!L) return;

    let center = { lat: 23.8103, lng: 90.4125 }; 
    try {
      const loc = user?.location;
      if (loc && (loc.district || loc.division)) {
        const key = loc.district || loc.division;
        if (districtCenters[key]) center = districtCenters[key];
      }
    } catch (e) { /* ignore and fallback */ }

    // initialize map 
    const map = L.map('local-risk-map', { zoomControl: true, dragging: true, attributionControl: false }).setView([center.lat, center.lng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const riskLevels = ['Low', 'Medium', 'High'];
    const riskBn = { Low: 'নিম্ন', Medium: 'মধ্যম', High: 'উচ্চ' };
    const riskColor = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444' };
    const cropsBn = ['ধান', 'গম', 'সবজি', 'আখ', 'ফল'];

    const generateMockPoints = (count = 12) => {
      const points = [];
      for (let i = 0; i < count; i++) {
        const lat = center.lat + (Math.random() - 0.5) * 0.04;
        const lng = center.lng + (Math.random() - 0.5) * 0.04;
        const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        const crop = cropsBn[Math.floor(Math.random() * cropsBn.length)];
        const hoursAgo = Math.floor(Math.random() * 72);
        points.push({ lat, lng, risk, crop, hoursAgo });
      }
      return points;
    };

    const neighbors = generateMockPoints(Math.floor(10 + Math.random() * 8));

    const farmer = (user && user.location && user.location.lat && user.location.lng)
      ? { lat: Number(user.location.lat), lng: Number(user.location.lng) }
      : { lat: center.lat, lng: center.lng };

    const farmerMarker = L.circleMarker([farmer.lat, farmer.lng], {
      radius: 10,
      color: '#2563eb',
      fillColor: '#2563eb',
      fillOpacity: 0.95,
      weight: 2
    }).addTo(map).bindPopup(isBn ? '<b>আপনি</b><br/>ফসল: পর্যালোচনা করুন' : '<b>You</b>');
    markersRef.current = [];
    markersRef.current.push(farmerMarker);

    neighbors.forEach((n, idx) => {
      const marker = L.circleMarker([n.lat, n.lng], {
        radius: n.risk === 'High' ? 10 : 7,
        color: riskColor[n.risk],
        fillColor: riskColor[n.risk],
        fillOpacity: 0.9,
        weight: 1
      }).addTo(map);

      const hoursBn = isBn ? toBanglaDigits(n.hoursAgo) : `${n.hoursAgo}`;
      const popupHtml = isBn
        ? `ফসল : ${n.crop}<br/>ঝুঁকি : ${riskBn[n.risk]}<br/>শেষ আপডেট : ${hoursBn} ঘন্টা আগে`
        : `Crop: ${n.crop}<br/>Risk: ${n.risk}<br/>Updated: ${hoursBn} hrs ago`;

      marker.bindPopup(popupHtml);
      markersRef.current.push({ marker, data: n });
    });

    const distanceKm = (a, b) => {
      const toRad = (v) => (v * Math.PI) / 180;
      const R = 6371; // km
      const dLat = toRad(b.lat - a.lat);
      const dLon = toRad(b.lng - a.lng);
      const lat1 = toRad(a.lat);
      const lat2 = toRad(b.lat);
      const aa = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa));
      return R * c;
    };

    const nearby = markersRef.current.filter(m => m.data).map(m => ({...m.data, marker: m.marker, distKm: distanceKm(farmer, m.data)}));
    const dynamicAlerts = nearby.filter(n => (n.risk === 'High' && n.distKm <= 8) || (n.risk === 'Medium' && n.distKm <= 3));
    dynamicAlerts.sort((a,b) => {
      const score = { High: 3, Medium: 2, Low: 1 };
      return (score[b.risk] - score[a.risk]) || (a.distKm - b.distKm);
    });
    setAlerts(dynamicAlerts);

    mapRef.current = map;

    return () => {
      try { map.remove(); } catch (e) { }
    };
  }, [controls, user, isBn]);

  const handleViewReport = () => {
    try {
      if (mapContainerRef.current && mapContainerRef.current.scrollIntoView) {
        mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      const map = mapRef.current;
      if (!map) return;

      if (alerts && alerts.length > 0) {
        const top = alerts[0];
        if (top.marker) {
          map.setView([top.lat, top.lng], 14, { animate: true });
          top.marker.openPopup();
          return;
        }
      }
      
      map.setView([map.getCenter().lat, map.getCenter().lng], 12, { animate: true });
    } catch (e) { /* no-op */ }
  };

  const handleViewAlert = () => {
    try {
      const map = mapRef.current;
      if (!map) return;
      if (alerts && alerts.length > 0) {
        const top = alerts[0];
        if (top.marker) {
          map.setView([top.lat, top.lng], 14, { animate: true });
          top.marker.openPopup();
        }
      }
    } catch (e) { /* no-op */ }
  };

  // Data for stat cards
  const stats = [
    { icon: '📉', number: isBn ? '৪.৫M' : '4.5M', labelBn: 'বার্ষিক হারানো টন', labelEn: 'Metric Tonnes Lost Annually' },
    { icon: '💲', number: isBn ? '$১.৫B' : '$1.5B', labelBn: 'বার্ষিক অর্থনৈতিক ক্ষতি', labelEn: 'Economic Loss Per Year' },
    { icon: '⚠️', number: isBn ? '৩৮M+' : '38M+', labelBn: 'খাদ্য অনিরাপত্তায় থাকা মানুষ', labelEn: 'People Facing Food Insecurity' }
  ];

  return (
    <section className="relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fff7f4] via-[#ffe8df] to-[#ffd7ca] py-20 px-5">

      {/* Decorative Gradient Blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#ffd7ca] to-[#fff2f0] opacity-60 blur-3xl transform -rotate-12" />
        <div className="absolute -right-40 bottom-0 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#fff7f4] to-[#ffe8df] opacity-60 blur-2xl" />
      </div>

      <div className="max-w-[1100px] mx-auto grid gap-8">
        <motion.div variants={container} initial="hidden" animate={controls} className="grid gap-5">

          {/* Header */}
          <motion.div variants={fadeUp} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div className="flex items-start gap-5">
              <motion.div variants={float} animate="animate" className="w-16 h-16 rounded-2xl bg-[rgba(255,60,60,0.14)] text-[#ff2e2e] flex items-center justify-center text-2xl shadow-[0_14px_28px_rgba(255,80,60,0.15)]">
                <span aria-hidden>⚠️</span>
              </motion.div>

              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#6e0d0d] leading-tight">
                  {isBn ? 'আমরা যে সংকটে আছি' : 'The Crisis We Face'}
                </h2>
                <p className="mt-2 text-sm text-[#5a3b2b] max-w-lg">
                  {isBn
                    ? 'বাংলাদেশ প্রতিবছর খাদ্য ব্যবস্থায় কোটি কোটি টাকার ক্ষতির মুখে পড়ে। এটি শুধু পরিসংখ্যান নয়—এটি বাস্তব ক্ষুধা।'
                    : 'Bangladesh loses billions in food every year. This is not just numbers—this is real hunger and wasted resources.'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <button onClick={handleViewReport} className="hidden md:inline-flex items-center gap-2 bg-white/90 backdrop-blur rounded-xl px-4 py-2 shadow hover:scale-105 transition-transform text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 4v8l6 3" stroke="#6e0d0d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-[#6e0d0d]">{isBn ? 'বিস্তারিত রিপোর্ট' : 'View Report'}</span>
              </button>
            </div>
          </motion.div>

          {/* Stats - Compact */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 md:gap-4">
            {stats.map((card, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260 }} className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#ff8a5b] to-[#ff4c2e] flex items-center justify-center text-xl text-white shadow-sm">{card.icon}</div>
                <div>
                  <div className="text-lg md:text-2xl font-extrabold text-[#222]">{card.number}</div>
                  <div className="text-[10px] md:text-xs text-[#6b7578]">{isBn ? card.labelBn : card.labelEn}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Map Section - Compact */}
          <motion.div variants={fadeUp} className="mt-4">
            {/* Header with Legend */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
              <h3 className="text-lg md:text-xl font-bold text-[#6e0d0d]">{isBn ? 'স্থানীয় ঝুঁকি মানচিত্র' : 'Local Risk Map'}</h3>
              
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs bg-white/70 backdrop-blur px-3 py-1.5 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
                  <span className="text-[#546168]">{isBn ? 'আপনি' : 'You'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
                  <span className="text-[#546168]">{isBn ? 'নিম্ন' : 'Low'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                  <span className="text-[#546168]">{isBn ? 'মধ্যম' : 'Medium'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                  <span className="text-[#546168]">{isBn ? 'উচ্চ' : 'High'}</span>
                </div>
              </div>
            </div>

            {/* Dynamic alert banner */}
            {alerts && alerts.length > 0 ? (
              <div className="mb-2 p-2.5 rounded-xl bg-gradient-to-r from-[#ffe7e5] to-[#ffd2cf] border border-[#ffb7b2] flex items-center justify-between gap-2">
                <div className="text-xs text-[#6e0d0d] flex-1">
                  ⚠️ {isBn ? `সতর্কতা: কাছাকাছি ${alerts.length}টি ঝুঁকিপূর্ণ পয়েন্ট` : `Alert: ${alerts.length} risky points nearby`}
                </div>
                <button onClick={handleViewAlert} className="bg-[#ef4444] text-white px-3 py-1 rounded-lg text-xs font-medium shadow hover:bg-[#dc2626] transition-colors">{isBn ? 'দেখুন' : 'View'}</button>
              </div>
            ) : (
              <div className="mb-2 p-2.5 rounded-xl bg-white/90 border border-[#e6f7ec] flex items-center justify-between gap-2">
                <div className="text-xs text-[#155724]">✓ {isBn ? 'কোনো আশঙ্কাজনক রিপোর্ট নেই' : 'No concerning reports nearby'}</div>
                <button onClick={handleViewReport} className="bg-[#22c55e] text-white px-3 py-1 rounded-lg text-xs font-medium shadow hover:bg-[#16a34a] transition-colors">{isBn ? 'মানচিত্র দেখুন' : 'View Map'}</button>
              </div>
            )}

            {/* Map Container */}
            <div ref={mapContainerRef} className="rounded-xl overflow-hidden shadow-lg border border-white/60 bg-gray-100">
              <div id="local-risk-map" style={{ width: '100%', height: 450 }} />
            </div>

            {/* Tip */}
            <p className="mt-1.5 text-[10px] text-center text-[#8b7355]">
              💡 {isBn ? 'মার্কারে ক্লিক করে বিস্তারিত দেখুন' : 'Click markers for details'}
            </p>

          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
