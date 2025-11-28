import React, { useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:3001";

const STRINGS = {
  bn: {
    title: "হার্ভেস্টগার্ড – পাতা স্বাস্থ্য পরীক্ষক",
    subtitle:
      "পাতার ছবি তুলুন বা গ্যালারি থেকে আপলোড করুন, আমরা দেখে বলব পাতা সুস্থ নাকি অসুস্থ।",
    useCamera: "📷 ক্যামেরা ব্যবহার করুন",
    upload: "📁 ডিভাইস থেকে আপলোড করুন",
    cameraHint: "ভালো আলোতে একটিমাত্র পাতার উপর ক্যামেরা ঠিকমতো ধরুন।",
    captureCheck: "📸 ছবি তুলুন এবং পরীক্ষা করুন",
    uploadHint1:
      "“ডিভাইস থেকে আপলোড করুন” বোতামে চাপ দিয়ে গ্যালারি থেকে পাতা নির্বাচন করুন।",
    uploadHint2:
      "পাতাটি যেন ছবিতে পরিষ্কার দেখা যায় এবং ফ্রেমের বেশিরভাগ অংশ জুড়ে থাকে।",
    noImage: "এখনও কোনো ছবি নেই। ক্যামেরা ব্যবহার করুন বা ছবি আপলোড করুন।",
    checking: "পাতা পরীক্ষা করা হচ্ছে...",
    noPrediction: "কোনো ফলাফল পাওয়া যায়নি।",
    clear: "🔄 সব মুছুন",
    tip: "পরিষ্কার দিনের আলোতে ছবি তুলুন, ক্যামেরা নাড়াবেন না – তাতে ফলাফল ভালো হবে।",
    healthyExtra: "পাতাটি দেখতে সুস্থ মনে হচ্ছে।",
    diseasedExtra: "পাতাটি অসুস্থ হতে পারে। গাছটি ভালোভাবে দেখে নিন।",
  },
  en: {
    title: "HarvestGuard – Leaf Health Checker",
    subtitle:
      "Take a photo or upload a leaf picture to see if it looks healthy or diseased.",
    useCamera: "📷 Use Camera",
    upload: "📁 Upload from Device",
    cameraHint:
      "Hold the camera steady and focus on a single leaf in good light.",
    captureCheck: "📸 Capture & Check",
    uploadHint1:
      "Click “Upload from Device” and pick a leaf photo from your gallery.",
    uploadHint2: "Make sure the leaf is clear and fills most of the picture.",
    noImage: "No image yet. Use the camera or upload a photo to begin.",
    checking: "Checking the leaf…",
    noPrediction: "No prediction received.",
    clear: "🔄 Clear",
    tip: "Take photos in daylight and hold the camera steady for best results.",
    healthyExtra: "This leaf looks healthy.",
    diseasedExtra: "This leaf may be diseased. Check the plant more closely.",
  },
};

export default function ScanCrop() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [lang, setLang] = useState("bn"); // default Bangla
  const t = STRINGS[lang];

  const [mode, setMode] = useState(null); // "camera" | "upload"
  const [cameraActive, setCameraActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode !== "camera") {
      stopCamera();
    }
  }, [mode]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(
          lang === "bn"
            ? "আপনার ব্রাউজারে ক্যামেরা কাজ করছে না।"
            : "Camera is not supported in this browser."
        );
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setImagePreview(null);
        setPrediction(null);
        setError(null);
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert(
        lang === "bn"
          ? "ক্যামেরায় প্রবেশ করা যাচ্ছে না। অনুমতি চেক করুন।"
          : "Could not access camera. Please check permissions."
      );
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

  const handleUseCamera = () => {
    setMode("camera");
    startCamera();
  };

  const handleUseUpload = () => {
    setMode("upload");
    setImagePreview(null);
    setPrediction(null);
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPrediction(null);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataURL = ev.target.result;
      setImagePreview(dataURL);
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const size = 224;
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        const scale = Math.max(size / img.width, size / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        const sx = (size - sw) / 2;
        const sy = (size - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh);
      };
      img.src = dataURL;
      await uploadAndPredict(dataURL);
    };
    reader.readAsDataURL(file);
  };

  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = 224;
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(videoRef.current, 0, 0, size, size);
    const dataURL = canvas.toDataURL("image/jpeg");
    setImagePreview(dataURL);
    setPrediction(null);
    setError(null);
    await uploadAndPredict(dataURL);
  };

  const uploadAndPredict = async (imageBase64) => {
    try {
      setLoading(true);
      setPrediction(null);
      setError(null);

      const res = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend error ${res.status}: ${text}`);
      }

      const result = await res.json();
      if (!Array.isArray(result) || result.length === 0) {
        throw new Error(t.noPrediction);
      }

      const top = result[0];
      setPrediction({ label: top.label, score: top.score });
    } catch (err) {
      console.error("Prediction error:", err);
      setError(
        err.message ||
          (lang === "bn" ? "প্রেডিকশন ব্যর্থ হয়েছে।" : "Prediction failed.")
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setImagePreview(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isHealthy =
    prediction &&
    (prediction.label.toLowerCase().includes("healthy") ||
      prediction.label.toLowerCase().includes("fresh"));

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background:
          "linear-gradient(160deg, #bbf7d0 0%, #ecfeff 40%, #e0f2fe 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          width: "100%",
          margin: "16px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "20px 24px 24px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header with language toggle */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "800",
                color: "#14532d",
                marginBottom: "4px",
              }}
            >
              🌾 {t.title}
            </h1>
            <p style={{ color: "#4b5563", fontSize: "14px" }}>{t.subtitle}</p>
          </div>
          <div>
            <div
              style={{
                display: "inline-flex",
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                overflow: "hidden",
                backgroundColor: "#f3f4f6",
              }}
            >
              <button
                onClick={() => setLang("bn")}
                style={{
                  padding: "6px 14px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  backgroundColor: lang === "bn" ? "#16a34a" : "transparent",
                  color: lang === "bn" ? "white" : "#4b5563",
                }}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLang("en")}
                style={{
                  padding: "6px 14px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  backgroundColor: lang === "en" ? "#16a34a" : "transparent",
                  color: lang === "en" ? "white" : "#4b5563",
                }}
              >
                English
              </button>
            </div>
          </div>
        </header>

        {/* Big mode buttons */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            marginBottom: "18px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleUseCamera}
            style={{
              flex: "1 1 220px",
              maxWidth: "260px",
              padding: "14px 16px",
              borderRadius: "16px",
              border: "none",
              cursor: "pointer",
              backgroundColor: mode === "camera" ? "#16a34a" : "#22c55e",
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {t.useCamera}
          </button>
          <button
            onClick={handleUseUpload}
            style={{
              flex: "1 1 220px",
              maxWidth: "260px",
              padding: "14px 16px",
              borderRadius: "16px",
              border: "2px solid #16a34a",
              cursor: "pointer",
              backgroundColor: mode === "upload" ? "#bbf7d0" : "white",
              color: "#166534",
              fontWeight: "700",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {t.upload}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)",
            gap: "18px",
          }}
        >
          {/* Left: Camera / instructions */}
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              padding: "12px",
              backgroundColor: "#f9fafb",
              minHeight: "260px",
            }}
          >
            {mode === "camera" ? (
              <>
                <div
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "black",
                    marginBottom: "10px",
                  }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      maxHeight: "360px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#4b5563" }}>
                    {t.cameraHint}
                  </span>
                  <button
                    onClick={captureFromCamera}
                    disabled={loading || !cameraActive}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "999px",
                      border: "none",
                      backgroundColor: "#f97316",
                      color: "white",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor:
                        loading || !cameraActive ? "not-allowed" : "pointer",
                      opacity: loading || !cameraActive ? 0.7 : 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.captureCheck}
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#f1f5f9",
                  height: "100%",
                  minHeight: "260px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "16px",
                }}
              >
                <div>
                  <p style={{ marginBottom: "8px", color: "#4b5563" }}>
                    {t.uploadHint1}
                  </p>
                  <p style={{ fontSize: "13px", color: "#6b7280" }}>
                    {t.uploadHint2}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Preview & result */}
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              padding: "12px",
              backgroundColor: "#f9fafb",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              minHeight: "260px",
            }}
          >
            <div
              style={{
                borderRadius: "12px",
                backgroundColor: "white",
                border: "1px dashed #cbd5f5",
                padding: "10px",
                minHeight: "180px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Leaf preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "220px",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <div style={{ textAlign: "center", color: "#6b7280" }}>
                  {t.noImage}
                </div>
              )}
            </div>

            <div>
              {loading && (
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: "999px",
                    backgroundColor: "#fef9c3",
                    color: "#854d0e",
                    fontSize: "13px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>⏳</span>
                  <span>{t.checking}</span>
                </div>
              )}

              {error && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px 10px",
                    borderRadius: "10px",
                    backgroundColor: "#fee2e2",
                    color: "#b91c1c",
                    fontSize: "13px",
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              {prediction && !loading && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    backgroundColor: isHealthy ? "#dcfce7" : "#fee2e2",
                    color: isHealthy ? "#166534" : "#b91c1c",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "16px",
                      marginBottom: "4px",
                    }}
                  >
                    {prediction.label}
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    Confidence: {(prediction.score * 100).toFixed(1)}%
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      marginTop: "6px",
                    }}
                  >
                    {isHealthy ? t.healthyExtra : t.diseasedExtra}
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <button
                onClick={clearAll}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "white",
                  color: "#374151",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {t.clear}
              </button>
              <span
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  textAlign: "right",
                }}
              >
                {t.tip}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Hidden canvas for processing */}
      <canvas
        ref={canvasRef}
        width={224}
        height={224}
        style={{ display: "none" }}
      ></canvas>
    </div>
  );
}
