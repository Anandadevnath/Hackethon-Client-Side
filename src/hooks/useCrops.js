import { useState, useEffect } from 'react';
import api from '../services/api';

export const useCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCrops = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { ok, data } = await api.get('/crop/', { headers });
      if (ok) setCrops(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      console.error("Failed to load crops", err);
    } finally {
      setLoading(false);
    }
  };

  const createCrop = async (body, token) => {
    const { ok, data } = await api.post('/crop/', body, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (ok) setCrops((prev) => [data?.data ?? data, ...prev]);
    return { ok, data };
  };

  const updateCrop = async (id, body, token) => {
    const { ok, data } = await api.patch(`/crop/update/${id}`, body, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (ok) setCrops((prev) => prev.map((c) => ((c._id ?? c.id) === id ? (data?.data ?? data) : c)));
    return { ok, data };
  };

  const deleteCrop = async (id, token) => {
    const { ok, data } = await api.del(`/crop/delete/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (ok) setCrops((prev) => prev.filter((c) => (c._id ?? c.id) !== id));
    return { ok, data };
  };

  useEffect(() => { loadCrops(); }, []);

  return { crops, setCrops, loading, loadCrops, createCrop, updateCrop, deleteCrop };
};
