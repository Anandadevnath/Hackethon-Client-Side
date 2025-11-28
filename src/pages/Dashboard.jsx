// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { CloudSun, AlertTriangle, Info, Plus, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  "http://localhost:8000";

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
  const [upazila, setUpazila] = useState(
    () => localStorage.getItem("selectedUpazila") || "Dhaka"
  );
  const [forecast, setForecast] = useState([]); // 5-day forecast array
  const [loadingWeather, setLoadingWeather] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      text: "High humidity detected - improve ventilation",
      level: "high",
    },
    { id: 2, text: "Rain forecasted in 2 days", level: "medium" },
  ]);
  const [tips, setTips] = useState([
    "Check moisture levels in the morning",
    "Rain expected in 2 days - cover outdoor storage",
    "Temperature rising - improve ventilation",
  ]);

  // Create crop modal & form
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

  // Load crops
  useEffect(() => {
    loadCrops();
    loadWeatherForUpazila(upazila);
  }, []);

  async function loadCrops() {
    setLoadingCrops(true);
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/crop/`, {
        method: "GET",
        headers,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
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

  // Fetch 5-day forecast from Open-Meteo for an Upazila name
  async function loadWeatherForUpazila(name) {
    if (!name) return;
    setLoadingWeather(true);
    try {
      localStorage.setItem("selectedUpazila", name);
      const geo = await geocodeUpazila(name);
      const lat = geo?.lat ?? 23.8103;
      const lon = geo?.lon ?? 90.4125;

      // Request daily precipitation probability and temperature, plus hourly humidity
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=relativehumidity_2m&current_weather=true&timezone=Asia%2FDhaka`;
      const res = await fetch(url);
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.daily) {
        // Build a simple 5-day summary
        const days = (d.daily.time || []).slice(0, 5).map((t, i) => ({
          date: t,
          temp_max: d.daily.temperature_2m_max?.[i],
          temp_min: d.daily.temperature_2m_min?.[i],
          precip_prob: d.daily.precipitation_probability_max?.[i] ?? 0,
        }));

        // get current humidity from hourly series nearest to current time
        let humidity = weather.humidity;
        if (d.hourly && d.hourly.relativehumidity_2m && d.hourly.time) {
          const nowIso = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
          // find first hourly index that starts with today's hour
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
          location: name,
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
  }

  // Submit create crop
  async function handleCreate(e) {
    e.preventDefault();
    setErrors([]);
    setCreating(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/crop/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          cropType: form.cropType,
          estimatedWeightKg: Number(form.estimatedWeightKg || 0),
          harvestDate: form.harvestDate,
          storageLocation: {
            division: form.storageDivision,
            district: form.storageDistrict,
          },
          storageType: form.storageType,
          notes: form.notes,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
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

  return (
    <div className="min-h-screen bg-[#F5FFF6] px-8 py-8 mt-20">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-green-600">
          Friday, {new Date().toLocaleDateString()}
        </div>
        <h1 className="text-3xl font-extrabold text-[#0b5f37] mt-2">
          Welcome Back, {user?.name || "Farmer"} 👋
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
          <div className="font-semibold">Add New Crop Batch</div>
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
          <div className="font-medium text-[#5a4b00]">View Warnings</div>
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
          <div className="font-medium text-[#0d7a4e]">Scan Crop (AI)</div>
        </motion.button>
      </motion.div>

      {/* Main grid: left big column and right side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-gradient-to-b from-[#0b6d3d] to-[#067444] text-white rounded-2xl p-6 shadow-[0_30px_60px_rgba(7,96,50,0.08)]"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">Weather Highlight</h2>
                <div className="text-sm mt-1 opacity-90">
                  {weather.location}
                </div>
              </div>
              <div className="text-2xl opacity-80">
                <CloudSun />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/8 rounded-xl p-4">
                <div className="text-2xl font-bold">{weather.temp}</div>
                <div className="text-xs opacity-90 mt-1">Temperature</div>
              </div>
              <div className="bg-white/8 rounded-xl p-4">
                <div className="text-2xl font-bold">{weather.humidity}</div>
                <div className="text-xs opacity-90 mt-1">Humidity</div>
              </div>
              <div className="bg-white/8 rounded-xl p-4">
                <div className="text-2xl font-bold">{weather.rainfall}</div>
                <div className="text-xs opacity-90 mt-1">Rainfall</div>
              </div>
            </div>

            <a className="mt-4 inline-block text-sm underline text-white/90">
              5-Day Forecast →
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
                Your Crop Batches
              </h3>
              <a className="text-sm text-green-600 flex items-center gap-2">
                <Eye size={14} /> View All
              </a>
            </div>

            <div className="space-y-3">
              {loadingCrops ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : crops.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No crop batches yet. Add one to get started.
                </div>
              ) : (
                crops.map((c, i) => {
                  // normalize fields that may be in different shapes
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
                          {/* simple box icon */}
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

                      <div className="flex items-center gap-3">
                        <div>
                          <RiskBadge
                            level={c.risk || c.priority || c.status || "Low"}
                          />
                        </div>
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
              <h4 className="font-semibold text-[#0b5f37]">Risk Alerts</h4>
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
                  {a.text}
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
              <h4 className="font-semibold">Tips for Today</h4>
            </div>

            <ul className="list-disc ml-5 mt-2 space-y-2 text-sm">
              {tips.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
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
                  Add New Crop Batch
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
                <input
                  name="cropType"
                  value={form.cropType}
                  onChange={handleFormChange}
                  placeholder="Crop (e.g. Rice)"
                  className="col-span-2 border p-3 rounded"
                />
                <input
                  name="estimatedWeightKg"
                  value={form.estimatedWeightKg}
                  onChange={handleFormChange}
                  placeholder="Estimated weight (kg)"
                  className="border p-3 rounded"
                />
                <input
                  name="harvestDate"
                  value={form.harvestDate}
                  onChange={handleFormChange}
                  type="date"
                  className="border p-3 rounded"
                />
                <input
                  name="storageDivision"
                  value={form.storageDivision}
                  onChange={handleFormChange}
                  placeholder="Storage Division"
                  className="border p-3 rounded"
                />
                <input
                  name="storageDistrict"
                  value={form.storageDistrict}
                  onChange={handleFormChange}
                  placeholder="Storage District"
                  className="border p-3 rounded"
                />
                <select
                  name="storageType"
                  value={form.storageType}
                  onChange={handleFormChange}
                  className="border p-3 rounded"
                >
                  <option>Silo</option>
                  <option>Jute Bag Stack</option>
                  <option>Open Area</option>
                </select>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  placeholder="Notes"
                  className="col-span-2 border p-3 rounded h-24"
                ></textarea>

                <div className="col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 rounded bg-[#0f7a48] text-white"
                  >
                    {creating ? "Saving..." : "Save Crop"}
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
function RiskBadge({ level }) {
  const lvl = (level || "low").toString().toLowerCase();
  if (lvl === "high")
    return (
      <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-semibold">
        High
      </span>
    );
  if (lvl === "medium")
    return (
      <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-sm font-semibold">
        Medium
      </span>
    );
  return (
    <span className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm font-semibold">
      Low
    </span>
  );
}
