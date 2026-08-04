import { useState } from 'react';

const API_URL = "https://hackethon-server-side-br4m.vercel.app";

export const usePestIdentification = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const identifyPest = async (file, division, district) => {
    setError(null);
    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    if (division) formData.append("division", division);
    if (district) formData.append("district", district);

    try {
      const res = await fetch(`${API_URL}/api/pest-identify`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const json = await res.json();
      setResult(json);
    } catch (err) {
      setError(err.message || "আপলোড ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, error, identifyPest, setResult, setError };
};
