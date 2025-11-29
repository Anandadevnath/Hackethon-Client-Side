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
        const lat = center.lat + (Math.random() - 0.5) * 0.08;
        const lng = center.lng + (Math.random() - 0.5) * 0.08;
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
    { icon: '⚠️', number: isBn ? '৩৮M+' : '38M+', labelBn: 'খাদ্য অনিরাপত্তায় থাকা মানুষ', labelEn: 'People Facing Food Insecurity' }
  ];

  return (
    <section className="relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fff7f4] via-[#ffe8df] to-[#ffd7ca] py-24 px-5">

      {/* Decorative Gradient Blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#ffd7ca] to-[#fff2f0] opacity-60 blur-3xl transform -rotate-12" />
        <div className="absolute -right-40 bottom-0 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#fff7f4] to-[#ffe8df] opacity-60 blur-2xl" />
      </div>

      <div className="max-w-[1200px] mx-auto grid gap-10">
        <motion.div variants={container} initial="hidden" animate={controls} className="grid gap-6">

          {/* Header */}
          <motion.div variants={fadeUp} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="flex items-start gap-6">
              <motion.div variants={float} animate="animate" className="w-20 h-20 rounded-3xl bg-[rgba(255,60,60,0.14)] text-[#ff2e2e] flex items-center justify-center text-3xl shadow-[0_18px_35px_rgba(255,80,60,0.18)]">
                <span aria-hidden>⚠️</span>
              </motion.div>

              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#6e0d0d] leading-tight">
                  {isBn ? 'আমরা যে সংকটে আছি' : 'The Crisis We Face'}
                </h2>
                <p className="mt-3 text-sm md:text-base text-[#5a3b2b] max-w-xl">
                  {isBn
                    ? 'বাংলাদেশ প্রতিবছর খাদ্য ব্যবস্থায় কোটি কোটি টাকার ক্ষতির মুখে পড়ে। এটি শুধু পরিসংখ্যান নয়—এটি বাস্তব ক্ষুধা, নষ্ট হওয়া সম্পদ এবং দুঃখজনক সামাজিক প্রভাব।'
                    : 'Bangladesh loses billions of taka in food every year. This is not just numbers—this is real hunger, wasted resources, and deep social impact.'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <button onClick={handleViewReport} className="hidden md:inline-flex items-center gap-2 bg-white/90 backdrop-blur rounded-2xl px-4 py-2 shadow hover:scale-105 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 4v8l6 3" stroke="#6e0d0d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-sm text-[#6e0d0d]">{isBn ? 'বিস্তারিত রিপোর্ট' : 'View Report'}</span>
              </button>
            </div>
          </motion.div>

          {/* Bullets */}
          <motion.ul variants={fadeUp} className="grid md:grid-cols-3 gap-6">
            {isBn ? (
              <>
                <li className="flex items-start gap-3 bg-white/80 p-4 rounded-2xl shadow"> <div className="text-red-500 text-2xl">•</div> <div className="text-sm text-[#5a3b2b]">ফসল সংগ্রহের পরবর্তী ক্ষতি ধান, গম এবং সবজিতে বেশি</div></li>
                <li className="flex items-start gap-3 bg-white/80 p-4 rounded-2xl shadow"> <div className="text-red-500 text-2xl">•</div> <div className="text-sm text-[#5a3b2b]">অপর্যাপ্ত সংরক্ষণ সুবিধা ও দুর্বল অবকাঠামো প্রধান কারণ</div></li>
                <li className="flex items-start gap-3 bg-white/80 p-4 rounded-2xl shadow"> <div className="text-red-500 text-2xl">•</div> <div className="text-sm text-[#5a3b2b]">জলবায়ু পরিবর্তনের অস্থিরতা ক্ষতির হার আরও বাড়ায়</div></li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-3 bg-white/80 p-4 rounded-2xl shadow"> <div className="text-red-500 text-2xl">•</div> <div className="text-sm text-[#5a3b2b]">Post-harvest losses severely affect rice, wheat and vegetables</div></li>
                <li className="flex items-start gap-3 bg-white/80 p-4 rounded-2xl shadow"> <div className="text-red-500 text-2xl">•</div> <div className="text-sm text-[#5a3b2b]">Poor storage facilities and weak infrastructure increase spoilage</div></li>
                <li className="flex items-start gap-3 bg-white/80 p-4 rounded-2xl shadow"> <div className="text-red-500 text-2xl">•</div> <div className="text-sm text-[#5a3b2b]">Climate volatility increases vulnerability</div></li>
              </>
            )}
          </motion.ul>

          {/* Stats */}
          <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-6 mt-4">
            {stats.map((card, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 260 }} className="bg-white rounded-3xl p-6 shadow-lg flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-[#ff8a5b] to-[#ff4c2e] flex items-center justify-center text-2xl text-white shadow-md">{card.icon}</div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#222]">{card.number}</div>
                  <div className="text-xs md:text-sm text-[#6b7578]">{isBn ? card.labelBn : card.labelEn}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Loss effect text */}
          <motion.div variants={fadeUp} className="mt-6 bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md">
            <p className="text-center text-[#7a2f2f] text-base md:text-lg">
              {isBn
                ? 'এই ক্ষতিগুলো কৃষকের আয়, পরিবারিক জীবন এবং পরিবেশকে সরাসরি প্রভাবিত করে—ফলে জাতীয় খাদ্য নিরাপত্তা হুমকির মুখে পড়ে।'
                : "These losses directly affect farmers’ income, household stability, and the environment—pushing national food security at risk."}
            </p>
          </motion.div>

          {/* Map Section */}
          <motion.div variants={fadeUp} className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl md:text-3xl font-bold text-[#6e0d0d]">{isBn ? 'স্থানীয় ঝুঁকি মানচিত্র' : 'Local Risk Map'}</h3>
              <div className="text-sm text-[#546168]">{isBn ? 'নীল পিন: আপনার অবস্থান — অন্যান্য পয়েন্টগুলো সম্পূর্ণ স্বনামের থাকছে।' : 'Blue pin: your location — neighbors shown anonymously.'}</div>
            </div>

            {/* Dynamic alert banner - depends on computed alerts */}
            {alerts && alerts.length > 0 ? (
              <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-[#ffe7e5] to-[#ffd2cf] border border-[#ffb7b2] flex items-center justify-between">
                <div className="text-sm text-[#6e0d0d]">
                  {isBn ? `সতর্কতা: আপনার কাছাকাছি ${alerts.length}টি ঝুঁকিপূর্ণ পয়েন্ট শনাক্ত হয়েছে। প্রথমটি: ${alerts[0].risk}` : `Alert: ${alerts.length} potentially risky nearby points detected. Top: ${alerts[0].risk}`}
                </div>
                <div>
                  <button onClick={handleViewAlert} className="bg-[#ef4444] text-white px-3 py-2 rounded-lg text-sm shadow">{isBn ? 'দেখুন' : 'View Alert'}</button>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-4 rounded-2xl bg-white/90 border border-[#e6f7ec] flex items-center justify-between">
                <div className="text-sm text-[#155724]">{isBn ? 'বর্তমানে কোনো আশঙ্কাজনক প্রতিবেশী রিপোর্ট নেই।' : 'No concerning neighbor reports detected near you.'}</div>
                <div>
                  <button onClick={handleViewReport} className="bg-[#67c974] text-white px-3 py-2 rounded-lg text-sm shadow">{isBn ? 'মানচিত্র দেখুন' : 'View Map'}</button>
                </div>
              </div>
            )}

            <div ref={mapContainerRef} className="rounded-3xl overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
              <div id="local-risk-map" style={{ width: '100%', height: 480 }} />
            </div>

          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
