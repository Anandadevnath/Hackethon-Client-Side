import React, { useRef, useState } from "react";

const API_URL = "https://hackethon-server-side-1.onrender.com"; 

export default function PestUpload({ division = null, district = null }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);
    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);
    if (division) formData.append("division", division);
    if (district) formData.append("district", district);

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/pest-identify`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "আপলোড ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearAll = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      style={{ maxWidth: "600px", margin: "20px auto", textAlign: "center" }}
    >
      <h2 style={{ marginBottom: "12px", color: "#14532d" }}>
        পোকা / ক্ষতি চিহ্নিতকরণ
      </h2>

      <div style={{ marginBottom: "12px" }}>
        <button
          onClick={handleUploadClick}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            backgroundColor: "#16a34a",
            color: "white",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
          }}
        >
          ছবি আপলোড করুন
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {imagePreview && (
        <div style={{ marginBottom: "12px", display: "flex", justifyContent: "center" }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              display: "block",
              width: "auto",
              maxWidth: "260px",
              height: "auto",
              objectFit: "contain",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          />
        </div>
      )}

      {loading && (
        <div
          style={{
            marginBottom: "12px",
            padding: "8px 12px",
            borderRadius: "999px",
            backgroundColor: "#fef9c3",
            color: "#854d0e",
            display: "inline-block",
          }}
        >
          ⏳ লোড হচ্ছে...
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: "12px",
            padding: "8px 12px",
            borderRadius: "12px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: "12px",
            textAlign: "left",
            borderRadius: "12px",
            backgroundColor: "#f0fdf4",
            padding: "12px",
            color: "#166534",
          }}
        >
          <h3 style={{ fontWeight: "700", marginBottom: "6px" }}>ফলাফল:</h3>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {result.answer}
          </pre>

          {result.sources?.length > 0 && (
            <div
              style={{ marginTop: "8px", fontSize: "12px", color: "#4b5563" }}
            >
              <strong>Grounding sources:</strong>{" "}
              {result.sources.map((s) => s.id).join(", ")}
            </div>
          )}
        </div>
      )}

      {(imagePreview || result) && (
        <div style={{ marginTop: "12px" }}>
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
            🔄 পুনরায় চেষ্টা করুন
          </button>
        </div>
      )}
    </div>
  );
}
