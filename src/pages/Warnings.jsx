import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { generateRiskSummaryFromRow } from "../utils/riskEngine";
import { generateSmartAlert, simulateSMSNotification } from "../services/smartAlertService";

const STRINGS = {
  bn: {
    title: "🌾 HarvestGuard – ঝুঁকি ড্যাশবোর্ড",
    subtitle:
      "বিভাগ ও জেলা নির্বাচন করুন, দেখুন কোন ব্যাচে রোগের ঝুঁকি কতটা বেশি।",
    divisionLabel: "বিভাগ নির্বাচন করুন",
    divisionPlaceholder: "বিভাগ নির্বাচন করুন",
    districtLabel: "জেলা নির্বাচন করুন",
    districtAll: "সব জেলা",
    calcButton: "📊 ঝুঁকি হিসাব করুন",
    noResults:
      "ঝুঁকি তথ্য দেখানোর জন্য প্রথমে ‘ঝুঁকি হিসাব করুন’ বোতামে চাপ দিন।",
    forecastTitle: "৭ দিনের আবহাওয়ার পূর্বাভাস (ধারণা)",
    clearButton: "🔄 সব পরিষ্কার করুন",
  },
  en: {
    title: "🌾 HarvestGuard – Risk Dashboard",
    subtitle:
      "Choose division and district to see which batches have higher disease risk.",
    divisionLabel: "Select Division",
    divisionPlaceholder: "Select Division",
    districtLabel: "Select District",
    districtAll: "All Districts",
    calcButton: "📊 Calculate Risk",
    noResults: "Select a location and press “Calculate Risk” to see details.",
    forecastTitle: "7-Day Weather Forecast (Mock)",
    clearButton: "🔄 Clear All",
  },
};

export default function Warnings() {
  const [rows, setRows] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [riskResults, setRiskResults] = useState([]);
  const [lang, setLang] = useState("bn"); // Bangla default

  const t = STRINGS[lang];

  useEffect(() => {
    const loadXLSX = async () => {
      try {
        const response = await fetch("/mock_batch_state_data.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setRows(jsonData);

        const divisions = [
          ...new Set(jsonData.map((r) => r["Location (Division)"])),
        ];
        setDivisionOptions(divisions);
      } catch (err) {
        console.error("Failed to load XLSX:", err);
      }
    };
    loadXLSX();
  }, []);

  useEffect(() => {
    if (!selectedDivision) {
      setDistrictOptions([]);
      setSelectedDistrict("");
      return;
    }
    const districts = [
      ...new Set(
        rows
          .filter((r) => r["Location (Division)"] === selectedDivision)
          .map((r) => r["Location (District)"])
      ),
    ];
    setDistrictOptions(districts);
    setSelectedDistrict("");
  }, [selectedDivision, rows]);

  const handleCalculateRisk = () => {
    if (!selectedDivision) return;
    const filteredRows = rows.filter(
      (r) =>
        r["Location (Division)"] === selectedDivision &&
        (selectedDistrict
          ? r["Location (District)"] === selectedDistrict
          : true)
    );
    const results = filteredRows.map((r) => generateRiskSummaryFromRow(r));
    setRiskResults(results);
  };

  const handleClear = () => {
    setSelectedDivision("");
    setSelectedDistrict("");
    setDistrictOptions([]);
    setRiskResults([]);
  };

  const riskColor = {
    Low: "#16a34a",
    Moderate: "#facc15",
    High: "#f97316",
    Critical: "#dc2626",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: "96px 8px 32px",
        overflowX: "hidden",
        background:
          "linear-gradient(160deg, #bbf7d0 0%, #ecfeff 40%, #e0f2fe 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "16px 0",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "20px 16px 24px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          boxSizing: "border-box",
        }}
      >
        {/* Header + language toggle */}
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
                fontSize: "28px",
                fontWeight: "800",
                color: "#14532d",
                marginBottom: "4px",
              }}
            >
              {t.title}
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

        {/* Controls card */}
        <div
          style={{
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            padding: "14px 16px",
            backgroundColor: "#f9fafb",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <div style={{ minWidth: "220px" }}>
              <label
                style={{
                  fontSize: "13px",
                  color: "#374151",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {t.divisionLabel}
              </label>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  appearance: "auto",
                }}
              >
                <option value="">{t.divisionPlaceholder}</option>
                {divisionOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: "220px" }}>
              <label
                style={{
                  fontSize: "13px",
                  color: "#374151",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {t.districtLabel}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedDivision}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: selectedDivision ? "#ffffff" : "#e5e7eb",
                  color: "#111827",
                  cursor: selectedDivision ? "pointer" : "not-allowed",
                  appearance: "auto",
                }}
              >
                <option value="">{t.districtAll}</option>
                {districtOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginLeft: "auto",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleCalculateRisk}
                style={{
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border: "none",
                  backgroundColor: "#16a34a",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: selectedDivision ? "pointer" : "not-allowed",
                  opacity: selectedDivision ? 1 : 0.6,
                  whiteSpace: "nowrap",
                }}
              >
                {t.calcButton}
              </button>
              <button
                onClick={handleClear}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "white",
                  color: "#374151",
                  fontSize: "13px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t.clearButton}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {riskResults.length === 0 ? (
          <div
            style={{
              borderRadius: "14px",
              border: "1px dashed #cbd5f5",
              padding: "14px 16px",
              backgroundColor: "#eff6ff",
              color: "#1d4ed8",
              fontSize: "13px",
              textAlign: "center",
            }}
          >
            {t.noResults}
          </div>
        ) : (
          <div style={{ marginTop: "8px" }}>
            {riskResults.map((r, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#fffbeb",
                  padding: "16px 18px",
                  marginBottom: "16px",
                  borderLeft: `8px solid ${
                    riskColor[r.riskLevel] || "#6b7280"
                  }`,
                  borderRadius: "14px",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                  color: "#4b5563",
                }}
              >
                {/* SMS Notification Badge for Critical */}
                {r.riskLevel === "Critical" && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#dc2626",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      animation: "pulse 2s infinite",
                    }}
                  >
                    📱 SMS {lang === "bn" ? "পাঠানো হয়েছে" : "Sent"} (Console)
                  </div>
                )}

                <h3
                  style={{
                    color: riskColor[r.riskLevel] || "#374151",
                    marginBottom: "6px",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  {r.batchId} — {r.riskBn || r.riskLevel} {lang === "bn" ? "ঝুঁকি" : "Risk"}
                </h3>

                {/* Smart Bangla Alert Box */}
                {r.banglaAlert && (
                  <div
                    style={{
                      backgroundColor: r.riskLevel === "Critical" ? "#fef2f2" : 
                                       r.riskLevel === "High" ? "#fff7ed" :
                                       r.riskLevel === "Moderate" ? "#fefce8" : "#f0fdf4",
                      border: `1px solid ${riskColor[r.riskLevel] || "#6b7280"}`,
                      borderRadius: "12px",
                      padding: "12px 14px",
                      marginBottom: "12px",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "#1f2937",
                    }}
                  >
                    <div style={{ fontWeight: "600", marginBottom: "4px", color: riskColor[r.riskLevel] }}>
                      🤖 {lang === "bn" ? "স্মার্ট পরামর্শ:" : "Smart Advice:"}
                    </div>
                    {r.banglaAlert}
                  </div>
                )}

                <p style={{ fontSize: "13px", marginBottom: "10px", color: "#6b7280" }}>
                  {r.message}
                </p>

                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    marginBottom: "6px",
                    color: "#92400e",
                  }}
                >
                  {t.forecastTitle}
                </h4>
                <div
                  style={{
                    overflowX: "auto",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      backgroundColor: "#fff7ed",
                      fontSize: "12px",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid #fed7aa",
                            padding: "6px",
                            textAlign: "left",
                          }}
                        >
                          Day
                        </th>
                        <th
                          style={{
                            border: "1px solid #fed7aa",
                            padding: "6px",
                            textAlign: "left",
                          }}
                        >
                          Temp (°C)
                        </th>
                        <th
                          style={{
                            border: "1px solid #fed7aa",
                            padding: "6px",
                            textAlign: "left",
                          }}
                        >
                          Humidity (%)
                        </th>
                        <th
                          style={{
                            border: "1px solid #fed7aa",
                            padding: "6px",
                            textAlign: "left",
                          }}
                        >
                          Rain (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.forecast.map((f, i) => (
                        <tr key={i}>
                          <td
                            style={{
                              border: "1px solid #fed7aa",
                              padding: "6px",
                            }}
                          >
                            {f.day}
                          </td>
                          <td
                            style={{
                              border: "1px solid #fed7aa",
                              padding: "6px",
                            }}
                          >
                            {f.temp}
                          </td>
                          <td
                            style={{
                              border: "1px solid #fed7aa",
                              padding: "6px",
                            }}
                          >
                            {f.humidity}
                          </td>
                          <td
                            style={{
                              border: "1px solid #fed7aa",
                              padding: "6px",
                            }}
                          >
                            {f.rainProb}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
