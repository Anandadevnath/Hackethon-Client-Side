import React, { useEffect, useRef, useState } from "react";
import PestUpload from "../components/PestUpload";
import { motion } from "framer-motion";

const API_URL = "https://hackethon-server-side-1.onrender.com";

const fadeUp = {
hidden: { opacity: 0, y: 30 },
show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const fade = {
hidden: { opacity: 0 },
show: { opacity: 1, transition: { duration: 0.45 } },
};

const STRINGS = {
bn: {
title: "হার্ভেস্টগার্ড – পাতা স্বাস্থ্য পরীক্ষক",
subtitle:
"পাতার ছবি তুলুন বা আপলোড করুন, আমরা দেখে বলব পাতা সুস্থ নাকি অসুস্থ।",
useCamera: "📷 ক্যামেরা ব্যবহার",
upload: "📁 ছবি আপলোড",
cameraHint: "ভালো আলোতে একটি পাতার উপর ক্যামেরা ঠিকভাবে ধরুন।",
captureCheck: "📸 ছবি তুলুন ও পরীক্ষা করুন",
uploadHint1: "গ্যালারি থেকে একটি পরিষ্কার পাতা নির্বাচন করুন।",
uploadHint2: "পাতাটি যেন ছবিতে পরিষ্কার দেখা যায়।",
noImage: "এখনও কোনো ছবি নেই। আপলোড করুন বা ক্যামেরা ব্যবহার করুন।",
checking: "পাতা পরীক্ষা করা হচ্ছে...",
noPrediction: "কোনো ফলাফল পাওয়া যায়নি।",
clear: "🔄 সব মুছুন",
tip: "দিনের আলোতে ছবি তুলুন, ক্যামেরা স্থির রাখুন।",
healthyExtra: "পাতাটি দেখতে সুস্থ মনে হচ্ছে।",
diseasedExtra: "পাতাটি অসুস্থ হতে পারে, গাছটি ভালোভাবে পরীক্ষা করুন।",
},
en: {
title: "HarvestGuard – Leaf Health Checker",
subtitle:
"Take or upload a leaf photo to check if it’s healthy or diseased.",
useCamera: "📷 Use Camera",
upload: "📁 Upload Image",
cameraHint: "Hold steady & focus on a leaf in good lighting.",
captureCheck: "📸 Capture & Check",
uploadHint1: "Upload a clear photo of a leaf.",
uploadHint2: "Make sure the leaf is visible & centered.",
noImage: "No image yet. Use camera or upload.",
checking: "Checking leaf…",
noPrediction: "No prediction received.",
clear: "🔄 Clear",
tip: "Use daylight, keep the camera steady.",
healthyExtra: "This leaf looks healthy.",
diseasedExtra: "This leaf might be diseased.",
},
};

export default function ScanCrop() {
const videoRef = useRef(null);
const canvasRef = useRef(null);
const fileInputRef = useRef(null);

const [lang, setLang] = useState("bn");
const t = STRINGS[lang];

const [mode, setMode] = useState(null);
const [cameraActive, setCameraActive] = useState(false);
const [imagePreview, setImagePreview] = useState(null);
const [loading, setLoading] = useState(false);
const [prediction, setPrediction] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
if (mode !== "camera") stopCamera();
}, [mode]);

const startCamera = async () => {
try {
const stream = await navigator.mediaDevices.getUserMedia({
video: { facingMode: "environment" },
});
videoRef.current.srcObject = stream;
await videoRef.current.play();
setCameraActive(true);
} catch (e) {
alert("Camera permission required.");
}
};

const stopCamera = () => {
const stream = videoRef.current?.srcObject;
if (stream) {
stream.getTracks().forEach((t) => t.stop());
videoRef.current.srcObject = null;
}
setCameraActive(false);
};

const handleUpload = (e) => {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();

reader.onload = (ev) => {
  const img = new Image();
  img.src = ev.target.result;
  img.onload = () => {
    setImagePreview(ev.target.result);
    uploadAndPredict(ev.target.result);
  };
};

reader.readAsDataURL(file);

};

const capture = () => {
const canvas = canvasRef.current;
canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 224, 224);
const data = canvas.toDataURL("image/jpeg");
setImagePreview(data);
uploadAndPredict(data);
};

const uploadAndPredict = async (base64) => {
setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/predict`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ imageBase64: base64 }),
});

  const data = await res.json();
  setPrediction(data[0]);
} catch (e) {
  setError("Prediction failed");
}
setLoading(false);

};

const isHealthy =
prediction &&
(prediction.label.toLowerCase().includes("healthy") ||
prediction.label.toLowerCase().includes("fresh"));

return (
<motion.div
initial="hidden"
animate="show"
variants={fade}
className="min-h-screen py-6 px-4 sm md lg pt-28 bg-gradient-to-br from-green-200 via-sky-200 to-teal-50 flex justify-center"
>
<motion.div
variants={fadeUp}
className="w-full max-w-5xl bg-white rounded-2xl p-6 md shadow-2xl"
>
{/* HEADER */}
<motion.header
variants={fadeUp}
className="flex flex-col md justify-between md gap-4 mb-6"
>


🌿 {t.title}

{t.subtitle}



      {/* LANGUAGE SWITCH */}
      <div className="flex bg-slate-100 border border-slate-300 rounded-full overflow-hidden">
        {["bn", "en"].map((lng) => (
          <motion.button
            key={lng}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLang(lng)}
            className={`px-5 py-2 font-semibold ${
              lang === lng ? "bg-green-600 text-white" : "text-slate-600"
            }`}
          >
            {lng === "bn" ? "বাংলা" : "English"}
          </motion.button>
        ))}
      </div>
    </motion.header>

    {/* ACTION BUTTONS */}
    <motion.div
      variants={fadeUp}
      className="flex flex-wrap gap-4 mb-6"
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setMode("camera");
          startCamera();
        }}
        className="flex-1 min-w-[200px] bg-green-600 text-white font-bold py-3 rounded-xl"
      >
        {t.useCamera}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fileInputRef.current.click()}
        className="flex-1 min-w-[200px] bg-green-100 border-2 border-green-600 text-green-700 font-bold py-3 rounded-xl"
      >
        {t.upload}
      </motion.button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </motion.div>

    {/* RESPONSIVE GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* LEFT SIDE – CAMERA/UPLOAD */}
      <motion.div
        variants={fadeUp}
        className="bg-slate-50 p-4 rounded-xl border border-slate-200"
      >
        {mode === "camera" ? (
          <>
            <div className="overflow-hidden rounded-xl mb-3">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full bg-black object-cover"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-sm">{t.cameraHint}</span>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={capture}
                className="px-4 py-2 bg-orange-500 text-white font-bold rounded-full"
              >
                {t.captureCheck}
              </motion.button>
            </div>
          </>
        ) : (
          <div className="text-center text-slate-600">
            <p>{t.uploadHint1}</p>
            <p className="text-xs text-slate-500 mt-1">{t.uploadHint2}</p>
          </div>
        )}
      </motion.div>

      {/* RIGHT SIDE – PREVIEW & RESULT */}
      <motion.div
        variants={fadeUp}
        className="bg-slate-50 p-4 rounded-xl border border-slate-200"
      >
        <div className="border border-dashed border-slate-300 bg-white h-52 rounded-xl flex justify-center items-center overflow-hidden mb-3">
          {imagePreview ? (
            <img
              src={imagePreview}
              className="max-h-full rounded-xl"
            />
          ) : (
            <span className="text-slate-400 text-sm">{t.noImage}</span>
          )}
        </div>

        {loading && (
          <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
            ⏳ {t.checking}
          </div>
        )}

        {prediction && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-xl ${
              isHealthy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            <div className="font-bold text-lg">{prediction.label}</div>
            <div className="text-sm">
              Confidence: {(prediction.score * 100).toFixed(1)}%
            </div>
            <div className="mt-1 text-xs">
              {isHealthy ? t.healthyExtra : t.diseasedExtra}
            </div>
          </motion.div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setImagePreview(null);
              setPrediction(null);
            }}
            className="px-4 py-2 border border-slate-300 rounded-full bg-white"
          >
            {t.clear}
          </motion.button>

          <span className="text-xs text-slate-400">{t.tip}</span>
        </div>
      </motion.div>
    </div>

    {/* PEST DETECTION */}
    <motion.div
      variants={fadeUp}
      className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200"
    >
      <h2 className="text-lg font-bold text-green-900 mb-3">
        🐛 Pest Identification
      </h2>
      <PestUpload />
    </motion.div>
  </motion.div>

  <canvas ref={canvasRef} width={224} height={224} className="hidden"></canvas>
</motion.div>

);
}