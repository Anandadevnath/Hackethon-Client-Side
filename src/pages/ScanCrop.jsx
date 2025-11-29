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
    reader.onload = async (ev) => {
      const img = new Image();
      img.src = ev.target.result;
      img.onload = () => {
        setImagePreview(ev.target.result);
        uploadAndPredict(ev.target.result);
      };
    };
    reader.readAsDataURL(file);
  };

  const capture = async () => {
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
      style={{
        minHeight: "100vh",
        padding: "24px",
        paddingTop: "96px",
        background:
          "linear-gradient(145deg, #bbf7d0, #e0f2fe, #f0fdfa 90%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <motion.div
        variants={fadeUp}
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "white",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* HEADER */}
        <motion.header
          variants={fadeUp}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#14532d",
              }}
            >
              🌿 {t.title}
            </h1>
            <p style={{ color: "#475569", marginTop: "6px" }}>
              {t.subtitle}
            </p>
          </div>

          {/* LANGUAGE SWITCH */}
          <div
            style={{
              display: "flex",
              background: "#f1f5f9",
              borderRadius: "30px",
              border: "1px solid #cbd5e1",
            }}
          >
            {["bn", "en"].map((lng) => (
              <motion.button
                key={lng}
                whileTap={{ scale: 0.9 }}
                onClick={() => setLang(lng)}
                style={{
                  padding: "8px 14px",
                  fontWeight: "600",
                  borderRadius: "30px",
                  border: "none",
                  background: lang === lng ? "#16a34a" : "transparent",
                  color: lang === lng ? "white" : "#475569",
                }}
              >
                {lng === "bn" ? "বাংলা" : "English"}
              </motion.button>
            ))}
          </div>
        </motion.header>

        {/* ACTION BUTTONS */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMode("camera");
              startCamera();
            }}
            style={{
              flex: "1 1 220px",
              padding: "14px",
              borderRadius: "16px",
              background: "#16a34a",
              color: "white",
              border: "none",
              fontWeight: "700",
            }}
          >
            {t.useCamera}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current.click()}
            style={{
              flex: "1 1 220px",
              padding: "14px",
              borderRadius: "16px",
              background: "#e0fce4",
              border: "2px solid #16a34a",
              fontWeight: "700",
              color: "#166534",
            }}
          >
            {t.upload}
          </motion.button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </motion.div>

        {/* MAIN GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "20px",
          }}
        >
          {/* LEFT SIDE – CAMERA / UPLOAD */}
          <motion.div
            variants={fadeUp}
            style={{
              background: "#f8fafc",
              padding: "16px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            {mode === "camera" ? (
              <>
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      background: "black",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#475569", fontSize: "14px" }}>
                    {t.cameraHint}
                  </span>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={capture}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "30px",
                      background: "#f97316",
                      border: "none",
                      color: "white",
                      fontWeight: "700",
                    }}
                  >
                    {t.captureCheck}
                  </motion.button>
                </div>
              </>
            ) : (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#475569",
                }}
              >
                <p>{t.uploadHint1}</p>
                <p style={{ fontSize: "13px", color: "#6b7280" }}>
                  {t.uploadHint2}
                </p>
              </div>
            )}
          </motion.div>

          {/* RIGHT SIDE – PREVIEW & RESULT */}
          <motion.div
            variants={fadeUp}
            style={{
              background: "#f8fafc",
              padding: "16px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                border: "1px dashed #cbd5e1",
                background: "white",
                height: "200px",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "12px",
                overflow: "hidden",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    borderRadius: "12px",
                  }}
                />
              ) : (
                <span style={{ color: "#94a3b8" }}>{t.noImage}</span>
              )}
            </div>

            {loading && (
              <div
                style={{
                  padding: "10px",
                  background: "#fef9c3",
                  borderRadius: "10px",
                  color: "#854d0e",
                }}
              >
                ⏳ {t.checking}
              </div>
            )}

            {prediction && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background: isHealthy ? "#dcfce7" : "#fee2e2",
                  color: isHealthy ? "#166534" : "#b91c1c",
                }}
              >
                <div style={{ fontWeight: "700", fontSize: "16px" }}>
                  {prediction.label}
                </div>
                <div style={{ fontSize: "13px" }}>
                  Confidence: {(prediction.score * 100).toFixed(1)}%
                </div>
                <div style={{ marginTop: "6px", fontSize: "12px" }}>
                  {isHealthy ? t.healthyExtra : t.diseasedExtra}
                </div>
              </motion.div>
            )}

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setImagePreview(null);
                  setPrediction(null);
                }}
                style={{
                  padding: "8px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "30px",
                  background: "white",
                }}
              >
                {t.clear}
              </motion.button>

              <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                {t.tip}
              </span>
            </div>
          </motion.div>
        </div>

        {/* PEST DETECTION */}
        <motion.div
          variants={fadeUp}
          style={{
            marginTop: "24px",
            background: "#f8fafc",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#14532d",
              marginBottom: "12px",
            }}
          >
            🐛 Pest Identification
          </h2>

          <PestUpload />
        </motion.div>
      </motion.div>

      <canvas
        ref={canvasRef}
        width={224}
        height={224}
        style={{ display: "none" }}
      ></canvas>
    </motion.div>
  );
}


