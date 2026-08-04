// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { CloudSun, AlertTriangle, Info, Plus, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from '../services/api';
import BanglaVoice from '../components/BanglaVoice';
import { RiskBadge } from '../components/common/RiskBadge';
import { CROP_TYPES, STORAGE_TYPES, DIVISIONS, DISTRICTS_BY_DIVISION } from '../data/formOptions';

// Translations
const t = {
  en: {
    welcome: "Welcome Back",
    addCrop: "Add New Crop Batch",
    viewWarnings: "View Warnings",
    scanCrop: "Scan Crop (AI)",
    weatherHighlight: "Weather Highlight",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfall: "Rainfall",
    forecast: "5-Day Forecast",
    yourCrops: "Your Crop Batches",
    viewAll: "View All",
    loading: "Loading...",
    noCrops: "No crop batches yet. Add one to get started.",
    riskAlerts: "Risk Alerts",
    tipsToday: "Tips for Today",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save Crop",
    saving: "Saving...",
    update: "Update Crop",
    updating: "Updating...",
    editCrop: "Edit Crop Batch",
    high: "High",
    medium: "Medium",
    low: "Low",
    confirmDelete: "Are you sure you want to delete this crop batch?",
    alertHumidity: "High humidity detected - improve ventilation",
    alertRain: "Rain forecasted in 2 days",
    tipMoisture: "Check moisture levels in the morning",
    tipRain: "Rain expected in 2 days - cover outdoor storage",
    tipTemp: "Temperature rising - improve ventilation",
  },
  bn: {
    welcome: "স্বাগতম",
    addCrop: "নতুন ফসল ব্যাচ যোগ করুন",
    viewWarnings: "সতর্কতা দেখুন",
    scanCrop: "ফসল স্ক্যান (AI)",
    weatherHighlight: "আবহাওয়া হাইলাইট",
    temperature: "তাপমাত্রা",
    humidity: "আর্দ্রতা",
    rainfall: "বৃষ্টিপাত",
    forecast: "৫ দিনের পূর্বাভাস",
    yourCrops: "আপনার ফসল ব্যাচ",
    viewAll: "সব দেখুন",
    loading: "লোড হচ্ছে...",
    noCrops: "এখনো কোনো ফসল ব্যাচ নেই। শুরু করতে একটি যোগ করুন।",
    riskAlerts: "ঝুঁকি সতর্কতা",
    tipsToday: "আজকের টিপস",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    cancel: "বাতিল",
    save: "ফসল সংরক্ষণ",
    saving: "সংরক্ষণ হচ্ছে...",
    update: "ফসল আপডেট",
    updating: "আপডেট হচ্ছে...",
    editCrop: "ফসল ব্যাচ সম্পাদনা",
    high: "উচ্চ",
    medium: "মাঝারি",
    low: "নিম্ন",
    confirmDelete: "আপনি কি নিশ্চিত এই ফসল ব্যাচটি মুছতে চান?",
    alertHumidity: "উচ্চ আর্দ্রতা সনাক্ত - বায়ুচলাচল উন্নত করুন",
    alertRain: "২ দিনের মধ্যে বৃষ্টির পূর্বাভাস",
    tipMoisture: "সকালে আর্দ্রতার মাত্রা পরীক্ষা করুন",
    tipRain: "২ দিনের মধ্যে বৃষ্টি প্রত্যাশিত - বাইরের সংরক্ষণ ঢেকে রাখুন",
    tipTemp: "তাপমাত্রা বাড়ছে - বায়ুচলাচল উন্নত করুন",
  }
};

const motionContainer = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function Dashboard() {
  const { user, setMessage } = useAuth();
  const { lang } = useLanguage();
  const txt = t[lang] || t.en;
  const [crops, setCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const navigate = useNavigate();

  const [weather, setWeather] = useState({
    temp: "32°C",
    humidity: "75%",
    rainfall: "85%",
    location: "Dhaka",
    fetched: false,
  });

  const [upazila, setUpazila] = useState(() =>
    localStorage.getItem("selectedUpazila") || ""
  );
  const [forecast, setForecast] = useState([]); 
  const [loadingWeather, setLoadingWeather] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      textEn: "High humidity detected - improve ventilation",
      textBn: "উচ্চ আর্দ্রতা সনাক্ত - বায়ুচলাচল উন্নত করুন",
      level: "high",
    },
    { id: 2, textEn: "Rain forecasted in 2 days", textBn: "২ দিনের মধ্যে বৃষ্টির পূর্বাভাস", level: "medium" },
  ]);
  const [tips, setTips] = useState([
    { en: "Check moisture levels in the morning", bn: "সকালে আর্দ্রতার মাত্রা পরীক্ষা করুন" },
    { en: "Rain expected in 2 days - cover outdoor storage", bn: "২ দিনের মধ্যে বৃষ্টি প্রত্যাশিত - বাইরের সংরক্ষণ ঢেকে রাখুন" },
    { en: "Temperature rising - improve ventilation", bn: "তাপমাত্রা বাড়ছে - বায়ুচলাচল উন্নত করুন" },
  ]);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    cropType: "Rice",
    estimatedWeightKg: "",
    harvestDate: "",
    storageDivision: "",
    storageDistrict: "",
    storageType: "Silo",
    notes: "",
  });
  const [errors, setErrors] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);

  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    cropType: "",
    estimatedWeightKg: "",
    harvestDate: "",
    storageDivision: "",
    storageDistrict: "",
    storageType: "",
    notes: "",
  });
  const [editErrors, setEditErrors] = useState([]);
  const [editAvailableDistricts, setEditAvailableDistricts] = useState([]);

  useEffect(() => {
    loadCrops();
  }, []);

  useEffect(() => {
    try {
      const local = (localStorage.getItem("selectedUpazila") || "").trim();
      if (user) {
        let candidate = "";
        if (typeof user.location === "object" && user.location !== null) {
          candidate = user.location.upazila || user.location.district || user.location.division || "";
        } else if (typeof user.location === "string") {
          candidate = user.location.split(",")[0]?.trim() || "";
        }
        if (candidate && (!local || local === "Dhaka")) {
          setUpazila(candidate);
          return;
        }
      }

      if (local) {
        if (!upazila) setUpazila(local);
        return;
      }
    } catch (err) {
      console.warn('Failed to derive upazila from user profile', err);
    }
  }, [user]);

  useEffect(() => {
    if (!upazila) return;
    try {
      localStorage.setItem("selectedUpazila", upazila);
    } catch (e) {}
    loadWeatherForUpazila(upazila);
  }, [upazila]);

  async function loadCrops() {
    setLoadingCrops(true);
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { ok, data } = await api.get('/crop/', { headers });
      if (ok) {
        setCrops(Array.isArray(data) ? data : data.data ?? []);
      } else {
        setCrops([]);
      }
    } catch (err) {
      console.error("Failed to load crops", err);
      setCrops([]);
    } finally {
      setLoadingCrops(false);
    }
  }

  // Convert latin digits to Bangla digits (optional helper)
  function toBanglaDigits(input) {
    const map = {
      0: "০",
      1: "১",
      2: "২",
      3: "৩",
      4: "৪",
      5: "৫",
      6: "৬",
      7: "৭",
      8: "৮",
      9: "৯",
    };
    return String(input)
      .split("")
      .map((c) => map[c] ?? c)
      .join("");
  }

  // Geocode Upazila (Nominatim) -> {lat, lon, display_name}
  async function geocodeUpazila(name) {
    try {
      const q = encodeURIComponent(name + ", Bangladesh");
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`;
      const res = await fetch(url, { headers: { "Accept-Language": "bn" } });
      const arr = await res.json().catch(() => []);
      if (Array.isArray(arr) && arr.length > 0) {
        const r = arr[0];
        return {
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
          display_name: r.display_name,
        };
      }
    } catch (err) {
      console.warn("Geocode failed", err);
    }
    return null;
  }

  async function loadWeatherForUpazila(name) {
    if (!name) return;
    setLoadingWeather(true);
    try {
      localStorage.setItem("selectedUpazila", name);
      const geo = await geocodeUpazila(name);
      const lat = geo?.lat ?? 23.8103;
      const lon = geo?.lon ?? 90.4125;

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=relativehumidity_2m&current_weather=true&timezone=Asia%2FDhaka`;
      const res = await fetch(url);
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.daily) {
        const days = (d.daily.time || []).slice(0, 5).map((t, i) => ({
          date: t,
          temp_max: d.daily.temperature_2m_max?.[i],
          temp_min: d.daily.temperature_2m_min?.[i],
          precip_prob: d.daily.precipitation_probability_max?.[i] ?? 0,
        }));

        let humidity = weather.humidity;
        if (d.hourly && d.hourly.relativehumidity_2m && d.hourly.time) {
          const nowIso = new Date().toISOString().slice(0, 13); 
          const idx = d.hourly.time.findIndex((ts) => ts.startsWith(nowIso));
          if (idx >= 0)
            humidity = `${Math.round(d.hourly.relativehumidity_2m[idx])}%`;
        }

        setWeather((w) => ({
          ...w,
          temp: `${Math.round(
            d.current_weather?.temperature ?? days[0]?.temp_max ?? 0
          )}°C`,
          humidity: humidity,
          rainfall: `${days[0]?.precip_prob ?? 0}%`,
          location: geo?.display_name || name,
          fetched: true,
        }));
        setForecast(days);
      }
    } catch (err) {
      console.error("Failed to fetch forecast", err);
    } finally {
      setLoadingWeather(false);
    }
  }

  // Generate a short Bangla advisory based on forecast and crops
  function generateBanglaAdvisory(forecastArr, cropList) {
    if (!forecastArr || forecastArr.length === 0)
      return "কোনো পূর্বাভাস পাওয়া যায়নি।";
    // Check next 3 days rain probability
    const next3 = forecastArr.slice(0, 3);
    const maxRain = Math.max(...next3.map((d) => d.precip_prob || 0));
    const maxTemp = Math.max(...next3.map((d) => d.temp_max || -999));

    const advices = [];
    if (maxRain >= 70) {
      // If any rice crops, recommend harvest or cover
      const hasRice = (cropList || []).some(
        (c) =>
          (c.cropType || c.type || "").toLowerCase().includes("rice") ||
          (c.cropType || "").toLowerCase().includes("ধান")
      );
      if (hasRice) {
        advices.push(
          `আগামী ৩ দিন সম্ভবত বৃষ্টি ${toBanglaDigits(
            Math.round(maxRain)
          )}% → আজই ধান কাটুন বা ঢেকে রাখুন`
        );
      } else {
        advices.push(
          `আগামী ৩ দিন বৃষ্টির সম্ভাবনা ${toBanglaDigits(
            Math.round(maxRain)
          )}% → সংরক্ষণ ও ঢেকে রাখুন`
        );
      }
    }

    if (maxTemp >= 36) {
      advices.push(
        `তাপমাত্রা ${toBanglaDigits(
          Math.round(maxTemp)
        )}°C পর্যন্ত উঠতে পারে → শীতল/ছায়া এবং সেচ রাখুন`
      );
    }

    if (advices.length === 0)
      return "আবহাওয়া স্থিতিশীল দেখা যাচ্ছে — রোজ সকালে আবহাওয়া পরীক্ষা করুন।";
    return advices.join(" । ");
  }

  // Handle form input
  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // Update available districts when division changes
    if (name === 'storageDivision') {
      const districts = DISTRICTS_BY_DIVISION[value] || [];
      setAvailableDistricts(districts);
      // Reset district selection when division changes
      setForm((f) => ({ ...f, storageDistrict: '' }));
    }
  }

  // Submit create crop
  async function handleCreate(e) {
    e.preventDefault();
    setErrors([]);
    setCreating(true);
    try {
      const token = localStorage.getItem("accessToken");
      const body = {
        cropType: form.cropType,
        estimatedWeightKg: Number(form.estimatedWeightKg || 0),
        harvestDate: form.harvestDate,
        storageLocation: {
          division: form.storageDivision,
          district: form.storageDistrict,
        },
        storageType: form.storageType,
        notes: form.notes,
      };

      const { ok, data } = await api.post('/crop/', body, { headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });

      if (!ok) {
        const errs =
          data?.errors ??
          (data?.message ? [data.message] : ["Failed to create"]);
        setErrors(errs);
        try {
          errs.forEach((e) => toast.error(String(e)));
        } catch (e) {}
      } else {
        const created = data?.data ?? data;
        setCrops((prev) => [created, ...prev]);
        setShowCreate(false);
        setForm({
          cropType: "Rice",
          estimatedWeightKg: "",
          harvestDate: "",
          storageDivision: "",
          storageDistrict: "",
          storageType: "Silo",
          notes: "",
        });
        try {
          toast.success("Crop created successfully.");
        } catch (e) {
          /* ignore if toast not available */
        }
        if (typeof setMessage === "function")
          setMessage("Crop created successfully.");
      }
    } catch (err) {
      const msg = "Network or server error creating crop.";
      setErrors([msg]);
      try {
        toast.error(msg);
      } catch (e) {}
      console.error(err);
    } finally {
      setCreating(false);
    }
  }

  // Open edit modal with crop data
  function openEditModal(crop) {
    const id = crop._id ?? crop.id;
    setEditingId(id);
    
    const division = crop.storageLocation?.division || "";
    const districts = DISTRICTS_BY_DIVISION[division] || [];
    setEditAvailableDistricts(districts);
    
    setEditForm({
      cropType: crop.cropType ?? crop.type ?? "Rice",
      estimatedWeightKg: crop.estimatedWeightKg ?? crop.weight ?? "",
      harvestDate: crop.harvestDate ? crop.harvestDate.split('T')[0] : "",
      storageDivision: division,
      storageDistrict: crop.storageLocation?.district || "",
      storageType: crop.storageType ?? "Silo",
      notes: crop.notes ?? "",
    });
    setEditErrors([]);
    setShowEdit(true);
  }

  // Handle edit form input
  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
    
    if (name === 'storageDivision') {
      const districts = DISTRICTS_BY_DIVISION[value] || [];
      setEditAvailableDistricts(districts);
      setEditForm((f) => ({ ...f, storageDistrict: '' }));
    }
  }

  // Submit edit crop
  async function handleEdit(e) {
    e.preventDefault();
    setEditErrors([]);
    setEditing(true);
    try {
      const token = localStorage.getItem("accessToken");
      const body = {
        cropType: editForm.cropType,
        estimatedWeightKg: Number(editForm.estimatedWeightKg || 0),
        harvestDate: editForm.harvestDate,
        storageLocation: {
          division: editForm.storageDivision,
          district: editForm.storageDistrict,
        },
        storageType: editForm.storageType,
        notes: editForm.notes,
      };

      const { ok, data } = await api.patch(`/crop/update/${editingId}`, body, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!ok) {
        const errs =
          data?.errors ??
          (data?.message ? [data.message] : ["Failed to update"]);
        setEditErrors(errs);
        errs.forEach((e) => toast.error(String(e)));
      } else {
        const updated = data?.data ?? data;
        setCrops((prev) =>
          prev.map((c) => ((c._id ?? c.id) === editingId ? updated : c))
        );
        setShowEdit(false);
        setEditingId(null);
        toast.success("Crop updated successfully.");
      }
    } catch (err) {
      const msg = "Network or server error updating crop.";
      setEditErrors([msg]);
      toast.error(msg);
      console.error(err);
    } finally {
      setEditing(false);
    }
  }

  // Delete crop
  async function deleteCrop(id) {
    if (!confirm(txt.confirmDelete)) return;
    
    try {
      const token = localStorage.getItem("accessToken");
      const { ok, data } = await api.del(`/crop/delete/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!ok) {
        const msg = data?.message || "Failed to delete crop.";
        toast.error(msg);
      } else {
        setCrops((prev) => prev.filter((c) => (c._id ?? c.id) !== id));
        toast.success("Crop deleted successfully.");
      }
    } catch (err) {
      toast.error("Network or server error deleting crop.");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5FFF6] px-4 py-8 mt-20 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-green-600">
          {new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}
        </div>
        <h1 className="text-3xl font-extrabold text-[#0b5f37] mt-2">
          {txt.welcome}, {user?.name || (lang === 'bn' ? "কৃষক" : "Farmer")} 👋
        </h1>
      </div>

      {/* Quick Actions row */}
      <motion.div
        variants={motionContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 bg-[#0f7a48] text-white rounded-xl px-6 py-4 shadow-[0_10px_30px_rgba(15,122,72,0.14)]"
          onClick={() => setShowCreate(true)}
        >
          <div className="w-9 h-9 rounded-full bg-[#0e6b3d] flex items-center justify-center text-white">
            <Plus size={16} />
          </div>
          <div className="font-semibold">{txt.addCrop}</div>
        </motion.button>

        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 bg-[#fff7e6] border border-[#f3dfb0] rounded-xl px-6 py-4 shadow-sm"
          onClick={() => navigate("/warnings")}
        >
          <div className="w-9 h-9 rounded-full bg-[#fff2d8] flex items-center justify-center text-[#b06f00]">
            <AlertTriangle size={16} />
          </div>
          <div className="font-medium text-[#5a4b00]">{txt.viewWarnings}</div>
        </motion.button>

        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 bg-[#f0fff6] border border-[#cdeed8] rounded-xl px-6 py-4 shadow-sm"
          onClick={() => navigate("/scan-crop")}
        >
          <div className="w-9 h-9 rounded-full bg-[#eaf9ef] flex items-center justify-center text-[#0d7a4e]">
            <CloudSun size={16} />
          </div>
          <div className="font-medium text-[#0d7a4e]">{txt.scanCrop}</div>
        </motion.button>
      </motion.div>

      {/* Main grid: left big column and right side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-gradient-to-br from-[#0b6d3d] to-[#067444] text-white rounded-3xl p-8 shadow-xl shadow-green-900/10"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{txt.weatherHighlight}</h2>
                <div className="text-sm mt-1 opacity-90">
                  {weather.location}
                </div>
              </div>
              <div className="text-2xl opacity-80">
                <CloudSun />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold">{weather.temp}</div>
                <div className="text-xs opacity-80 mt-1 uppercase tracking-wider">{txt.temperature}</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold">{weather.humidity}</div>
                <div className="text-xs opacity-80 mt-1 uppercase tracking-wider">{txt.humidity}</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold">{weather.rainfall}</div>
                <div className="text-xs opacity-80 mt-1 uppercase tracking-wider">{txt.rainfall}</div>
              </div>
            </div>

            <a className="mt-4 inline-block text-sm underline text-white/90">
              {txt.forecast} →
            </a>
          </motion.div>

          {/* Crop Batches List (full width under weather) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl p-5 shadow-md border border-[#ecf8f0]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#0b5f37]">
                {txt.yourCrops}
              </h3>
              <a className="text-sm text-green-600 flex items-center gap-2">
                <Eye size={14} /> {txt.viewAll}
              </a>
            </div>

            <div className="space-y-3">
              {loadingCrops ? (
                <div className="text-sm text-gray-500">{txt.loading}</div>
              ) : crops.length === 0 ? (
                <div className="text-sm text-gray-600">
                  {txt.noCrops}
                </div>
              ) : (
                crops.map((c, i) => {
                  const id = c._id ?? c.id ?? i;
                  const cropType = c.cropType ?? c.type ?? "Crop";
                  const weight = c.estimatedWeightKg ?? c.weight ?? "";
                  const area =
                    c.storageLocation &&
                    (c.storageLocation.division || c.storageLocation.district)
                      ? `${c.storageLocation.division || ""}${
                          c.storageLocation.division &&
                          c.storageLocation.district
                            ? " · "
                            : ""
                        }${c.storageLocation.district || ""}`
                      : c.storageLocation || "";
                  const risk = c.risk || c.priority || c.status || "Low";

                  return (
                    <motion.div
                      key={id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between border border-[#eef7f0] rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#eaf7ee] flex items-center justify-center text-[#0aa05a]">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"
                              stroke="#0aa05a"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 7l9 6 9-6"
                              stroke="#0aa05a"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <div>
                          <div className="font-semibold text-[#0b5f37]">
                            {cropType}
                          </div>
                          <div className="text-xs text-[#4ea67b] mt-1">
                            {weight ? `${weight} kg · ${area}` : area}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT SIDE → Risk badge + Edit/Delete buttons */}
                      <div className="flex items-center gap-3">
                        {/* Risk Badge */}
                        <RiskBadge level={risk} lang={lang} />

                        {/* Edit Button */}
                        <button
                          className="text-blue-600 text-xs font-medium hover:underline"
                          onClick={() => openEditModal(c)}
                        >
                          {txt.edit}
                        </button>

                        {/* Delete Button */}
                        <button
                          className="text-red-600 text-xs font-medium hover:underline"
                          onClick={() => deleteCrop(id)}
                        >
                          {txt.delete}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Right column: Alerts + Tips */}
        <div className="flex flex-col gap-5">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl p-5 shadow-[0_18px_36px_rgba(31,37,46,0.06)] border border-[#f7ecec]"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-[#fff3f3] flex items-center justify-center text-red-600">
                <AlertTriangle />
              </div>
              <h4 className="font-semibold text-[#0b5f37]">{txt.riskAlerts}</h4>
            </div>

            <div className="space-y-3">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className={`p-3 rounded-md ${
                    a.level === "high"
                      ? "bg-red-50 border-l-4 border-red-300 text-red-700"
                      : "bg-yellow-50 border-l-4 border-yellow-300 text-yellow-700"
                  }`}
                >
                  {lang === 'bn' ? a.textBn : a.textEn}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-[#0b6d3d] text-white rounded-2xl p-5 shadow-[0_18px_36px_rgba(7,96,50,0.08)]"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Info />
              </div>
              <h4 className="font-semibold">{txt.tipsToday}</h4>
            </div>

            <ul className="list-disc ml-5 mt-2 space-y-2 text-sm">
              {tips.map((tip, idx) => (
                <li key={idx}>{lang === 'bn' ? tip.bn : tip.en}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className=""
          >
            <BanglaVoice
              upazila={upazila}
              weather={weather}
              advisory={generateBanglaAdvisory(forecast, crops)}
              tips={tips}
              crops={crops}
            />
          </motion.div>
        </div>
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#0b5f37]">
                  {txt.addCrop}
                </h3>
                <button
                  onClick={() => setShowCreate(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              {errors.length > 0 && (
                <div className="mb-3 bg-red-50 text-red-700 p-3 rounded">
                  {errors.map((e, i) => (
                    <div key={i}>{e}</div>
                  ))}
                </div>
              )}

              <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                {/* Crop Type Dropdown */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ফসলের ধরন / Crop Type
                  </label>
                  <select
                    name="cropType"
                    value={form.cropType}
                    onChange={handleFormChange}
                    className="w-full border p-3 rounded bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">-- Select Crop / ফসল নির্বাচন করুন --</option>
                    {CROP_TYPES.map((crop) => (
                      <option key={crop.value} value={crop.value}>
                        {crop.bn} ({crop.en})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estimated Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    আনুমানিক ওজন (কেজি)
                  </label>
                  <input
                    name="estimatedWeightKg"
                    value={form.estimatedWeightKg}
                    onChange={handleFormChange}
                    placeholder="e.g. 500"
                    type="number"
                    min="0"
                    className="w-full border p-3 rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Harvest Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ফসল কাটার তারিখ
                  </label>
                  <input
                    name="harvestDate"
                    value={form.harvestDate}
                    onChange={handleFormChange}
                    type="date"
                    className="w-full border p-3 rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Division Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    বিভাগ / Division
                  </label>
                  <select
                    name="storageDivision"
                    value={form.storageDivision}
                    onChange={handleFormChange}
                    className="w-full border p-3 rounded bg-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- বিভাগ নির্বাচন করুন --</option>
                    {DIVISIONS.map((div) => (
                      <option key={div.value} value={div.value}>
                        {div.bn} ({div.en})
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Dropdown (depends on Division) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    জেলা / District
                  </label>
                  <select
                    name="storageDistrict"
                    value={form.storageDistrict}
                    onChange={handleFormChange}
                    disabled={!form.storageDivision}
                    className={`w-full border p-3 rounded bg-white focus:ring-2 focus:ring-green-500 ${
                      !form.storageDivision ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">
                      {form.storageDivision ? '-- জেলা নির্বাচন করুন --' : '-- প্রথমে বিভাগ নির্বাচন করুন --'}
                    </option>
                    {availableDistricts.map((dist) => (
                      <option key={dist.value} value={dist.value}>
                        {dist.bn} ({dist.en})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Storage Type Dropdown */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    সংরক্ষণ পদ্ধতি / Storage Type
                  </label>
                  <select
                    name="storageType"
                    value={form.storageType}
                    onChange={handleFormChange}
                    className="w-full border p-3 rounded bg-white focus:ring-2 focus:ring-green-500"
                  >
                    {STORAGE_TYPES.map((storage) => (
                      <option key={storage.value} value={storage.value}>
                        {storage.bn} ({storage.en})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    নোট / Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleFormChange}
                    placeholder="অতিরিক্ত তথ্য লিখুন..."
                    className="w-full border p-3 rounded h-24 focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>

                <div className="col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 rounded border"
                  >
                    {txt.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 rounded bg-[#0f7a48] text-white"
                  >
                    {creating ? txt.saving : txt.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {showEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#0b5f37]">
                  {txt.editCrop}
                </h3>
                <button
                  onClick={() => setShowEdit(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              {editErrors.length > 0 && (
                <div className="mb-3 bg-red-50 text-red-700 p-3 rounded">
                  {editErrors.map((e, i) => (
                    <div key={i}>{e}</div>
                  ))}
                </div>
              )}

              <form onSubmit={handleEdit} className="grid grid-cols-2 gap-4">
                {/* Crop Type Dropdown */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ফসলের ধরন / Crop Type
                  </label>
                  <select
                    name="cropType"
                    value={editForm.cropType}
                    onChange={handleEditFormChange}
                    className="w-full border p-3 rounded bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">-- Select Crop / ফসল নির্বাচন করুন --</option>
                    {CROP_TYPES.map((crop) => (
                      <option key={crop.value} value={crop.value}>
                        {crop.bn} ({crop.en})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estimated Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    আনুমানিক ওজন (কেজি)
                  </label>
                  <input
                    name="estimatedWeightKg"
                    value={editForm.estimatedWeightKg}
                    onChange={handleEditFormChange}
                    placeholder="e.g. 500"
                    type="number"
                    min="0"
                    className="w-full border p-3 rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Harvest Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ফসল কাটার তারিখ
                  </label>
                  <input
                    name="harvestDate"
                    value={editForm.harvestDate}
                    onChange={handleEditFormChange}
                    type="date"
                    className="w-full border p-3 rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Division Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    বিভাগ / Division
                  </label>
                  <select
                    name="storageDivision"
                    value={editForm.storageDivision}
                    onChange={handleEditFormChange}
                    className="w-full border p-3 rounded bg-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- বিভাগ নির্বাচন করুন --</option>
                    {DIVISIONS.map((div) => (
                      <option key={div.value} value={div.value}>
                        {div.bn} ({div.en})
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Dropdown (depends on Division) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    জেলা / District
                  </label>
                  <select
                    name="storageDistrict"
                    value={editForm.storageDistrict}
                    onChange={handleEditFormChange}
                    disabled={!editForm.storageDivision}
                    className={`w-full border p-3 rounded bg-white focus:ring-2 focus:ring-green-500 ${
                      !editForm.storageDivision ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">
                      {editForm.storageDivision ? '-- জেলা নির্বাচন করুন --' : '-- প্রথমে বিভাগ নির্বাচন করুন --'}
                    </option>
                    {editAvailableDistricts.map((dist) => (
                      <option key={dist.value} value={dist.value}>
                        {dist.bn} ({dist.en})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Storage Type Dropdown */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    সংরক্ষণ পদ্ধতি / Storage Type
                  </label>
                  <select
                    name="storageType"
                    value={editForm.storageType}
                    onChange={handleEditFormChange}
                    className="w-full border p-3 rounded bg-white focus:ring-2 focus:ring-green-500"
                  >
                    {STORAGE_TYPES.map((storage) => (
                      <option key={storage.value} value={storage.value}>
                        {storage.bn} ({storage.en})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    নোট / Notes
                  </label>
                  <textarea
                    name="notes"
                    value={editForm.notes}
                    onChange={handleEditFormChange}
                    placeholder="অতিরিক্ত তথ্য লিখুন..."
                    className="w-full border p-3 rounded h-24 focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>

                <div className="col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="px-4 py-2 rounded border"
                  >
                    {txt.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={editing}
                    className="px-4 py-2 rounded bg-[#0f7a48] text-white"
                  >
                    {editing ? txt.updating : txt.update}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Small inline helper component used above */
/* Removed RiskBadge as it has been moved to a separate file */
