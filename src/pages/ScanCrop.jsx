import React, { useEffect, useRef, useState } from "react";
import PestUpload from "../components/PestUpload";
import { motion } from "framer-motion";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";

const API_URL = "https://hackethon-server-side-br4m.vercel.app";

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
    subtitle: "পাতার ছবি তুলুন বা আপলোড করুন, আমরা দেখে বলব পাতা সুস্থ নাকি অসুস্থ।",
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
    subtitle: "Take or upload a leaf photo to check if it’s healthy or diseased.",
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
      setImagePreview(ev.target.result);
      uploadAndPredict(ev.target.result);
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
      className="min-h-screen bg-[#F5FFF6] px-4 py-8 mt-20 max-w-[1400px] mx-auto"
    >
      <Card className="w-full max-w-4xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-green-900">🌿 {t.title}</h1>
            <p className="text-gray-600 mt-2">{t.subtitle}</p>
          </div>
          <div className="flex bg-[--color-brand-neutral-200] border border-[--color-brand-neutral-200] rounded-full p-1">
            {["bn", "en"].map((lng) => (
              <button
                key={lng}
                onClick={() => setLang(lng)}
                className={`px-5 py-2 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[--color-brand-highlight] ${
                  lang === lng ? "bg-[--color-brand-secondary] text-white" : "text-[--color-brand-neutral-600]"
                }`}
              >
                {lng === "bn" ? "বাংলা" : "English"}
              </button>
            ))}
          </div>
        </header>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => { setMode("camera"); startCamera(); }}>{t.useCamera}</Button>
          <Button variant="outline" onClick={() => fileInputRef.current.click()}>{t.upload}</Button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </div>

        {/* RESPONSIVE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT SIDE – CAMERA/UPLOAD */}
          <div className="bg-[--color-brand-neutral-100] p-4 rounded-2xl border border-[--color-brand-neutral-200]">
            {mode === "camera" ? (
              <>
                <video ref={videoRef} autoPlay muted playsInline className="w-full rounded-xl bg-black mb-4" />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-[--color-brand-neutral-500]">{t.cameraHint}</p>
                  <Button size="sm" onClick={capture}>{t.captureCheck}</Button>
                </div>
              </>
            ) : (
              <p className="text-center text-[--color-brand-neutral-500] py-12">{t.uploadHint1}</p>
            )}
          </div>

          {/* RIGHT SIDE – PREVIEW & RESULT */}
          <div className="bg-[--color-brand-neutral-100] p-6 rounded-2xl border border-[--color-brand-neutral-200]">
            <div className="border-2 border-dashed border-[--color-brand-neutral-200] bg-white h-52 rounded-2xl flex justify-center items-center overflow-hidden mb-6">
              {imagePreview ? <img src={imagePreview} className="max-h-full rounded-xl" /> : <span className="text-[--color-brand-neutral-400] text-sm">{t.noImage}</span>}
            </div>

            {loading && <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">⏳ {t.checking}</div>}

            {prediction && !loading && (
              <div className={`p-4 rounded-xl text-sm ${isHealthy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                <div className="font-bold text-lg mb-1">{prediction.label}</div>
                <div>Confidence: {(prediction.score * 100).toFixed(1)}%</div>
                <div className="mt-2 text-xs">{isHealthy ? t.healthyExtra : t.diseasedExtra}</div>
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={() => { setImagePreview(null); setPrediction(null); }}>{t.clear}</Button>
              <span className="text-xs text-[--color-brand-neutral-400]">{t.tip}</span>
            </div>
          </div>
        </div>

        {/* PEST DETECTION */}
        <div className="mt-10 border-t border-gray-100 pt-8">
          <h2 className="text-xl font-bold text-green-900 mb-6">🐛 Pest Identification</h2>
          <PestUpload />
        </div>
      </Card>
      <canvas ref={canvasRef} width={224} height={224} className="hidden"></canvas>
    </motion.div>
  );
}
