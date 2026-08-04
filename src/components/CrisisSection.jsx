import React, { useEffect, useRef, useState } from "react";
import { useRiskMap } from "../hooks/useRiskMap";
import { StatCard } from "./common/StatCard";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { motion, useAnimation } from "framer-motion";
import districtCenters from "../data/district-centers";

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
  const { user } = useAuth();
  const controls = useAnimation();
  const { mapRef, mapContainerRef, alerts, setAlerts } = useRiskMap(user);
  const markersRef = useRef([]);

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
    <section className="py-20 px-5 bg-white">
      <div className="max-w-[1100px] mx-auto grid gap-12">
        <motion.div variants={container} initial="hidden" animate={controls} className="grid gap-8">
          <motion.div variants={fadeUp} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-8 bg-green-50 rounded-3xl border border-green-100">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-3xl shadow-inner">⚠️</div>
              <div>
                <h2 className="text-3xl font-extrabold text-green-950">{isBn ? 'আমরা যে সংকটে আছি' : 'The Crisis We Face'}</h2>
                <p className="mt-2 text-green-800/80 max-w-lg">{isBn ? 'বাংলাদেশ প্রতিবছর খাদ্য ব্যবস্থায় কোটি কোটি টাকার ক্ষতির মুখে পড়ে।' : 'Bangladesh loses billions in food every year.'}</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((card, i) => (
              <StatCard key={i} icon={card.icon} number={card.number} label={isBn ? card.labelBn : card.labelEn} />
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-green-950 mb-6">{isBn ? 'স্থানীয় ঝুঁকি মানচিত্র' : 'Local Risk Map'}</h3>
            <div ref={mapContainerRef} className="rounded-2xl overflow-hidden border border-gray-200">
              <div id="local-risk-map" style={{ width: '100%', height: 450 }} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
