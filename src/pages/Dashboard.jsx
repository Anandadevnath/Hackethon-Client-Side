import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useAuth } from '../context/AuthContext';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:8000';

const Dashboard = () => {
  const { user, setMessage } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    cropType: 'Paddy',
    estimatedWeightKg: '',
    harvestDate: '',
    storageLocation: { division: '', district: '' },
    storageType: 'Silo',
    notes: ''
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = {};
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
        const res = await fetch(`${API_BASE}/crop/`, { method: 'GET', headers, credentials: 'include' });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data.data)) {
          setCrops(data.data);
        } else if (res.ok && Array.isArray(data)) {
          setCrops(data);
        }
      } catch (err) {
        // ignore for now
      }
    };
    fetchCrops();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'division' || name === 'district') {
      setForm(f => ({ ...f, storageLocation: { ...f.storageLocation, [name]: value } }));
    } else if (name === 'estimatedWeightKg') {
      setForm(f => ({ ...f, [name]: Number(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = { 'Content-Type': 'application/json' };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
      const payload = { ...form };
      const res = await fetch(`${API_BASE}/crop/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const created = data.data || data;
        // if API returns created object or array wrapper
        setCrops(prev => [created, ...prev]);
        setMessage('Crop created successfully');
        setErrors([]);
        // reset some fields
        setForm({ cropType: 'Paddy', estimatedWeightKg: '', harvestDate: '', storageLocation: { division: '', district: '' }, storageType: 'Silo', notes: '' });
      } else {
        // surface validation errors from server if present
        if (data && data.errors && Array.isArray(data.errors)) {
          setErrors(data.errors);
        } else if (data && data.message) {
          setErrors([data.message]);
        } else {
          setErrors(['Failed to create crop']);
        }
        setMessage(data.message || 'Failed to create crop');
      }
    } catch (err) {
      setMessage('Network error creating crop');
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-top">
        <div className="dashboard-brand">HarvestGuard</div>
        <h1 className="dashboard-welcome">Welcome Back, Farmer <span className="wave">👋</span></h1>
        <div className="dashboard-date">Friday, November 28, 2025</div>
      </div>

      <div className="dashboard-grid">
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-row">
            <button className="action add">+ Add New Crop Batch</button>
            <button className="action warn">⚠️ View Warnings</button>
            <button className="action scan">📷 Scan Crop (AI)</button>
          </div>
        </div>

        <div className="create-crop">
          <h3>Create Crop Batch</h3>
          <form className="crop-form" onSubmit={handleSubmit}>
            <label>Crop Type</label>
            <select name="cropType" value={form.cropType} onChange={handleChange} required>
              <option value="Paddy">Paddy</option>
              <option value="Rice">Rice</option>
            </select>

            <label>Estimated Weight (kg)</label>
            <input name="estimatedWeightKg" type="number" value={form.estimatedWeightKg} onChange={handleChange} required />

            <label>Harvest Date</label>
            <input name="harvestDate" type="date" value={form.harvestDate} onChange={handleChange} required />

            <label>Storage Division</label>
            <input name="division" value={form.storageLocation.division} onChange={handleChange} required />

            <label>Storage District</label>
            <input name="district" value={form.storageLocation.district} onChange={handleChange} required />

            <label>Storage Type</label>
            <select name="storageType" value={form.storageType} onChange={handleChange} required>
              <option value="Jute Bag Stack">Jute Bag Stack</option>
              <option value="Silo">Silo</option>
              <option value="Open Area">Open Area</option>
            </select>

            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} />

            <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Crop'}</button>
            {errors && errors.length > 0 && (
              <div className="form-errors">
                {errors.map((err, i) => <div key={i} style={{color:'#c33b2f',marginTop:8}}>- {err}</div>)}
              </div>
            )}
          </form>
        </div>

        <div className="risk-alerts">
          <h3>Risk Alerts</h3>
          <div className="alert high">High humidity detected - improve ventilation</div>
          <div className="alert normal">Rain forecasted in 2 days</div>
        </div>

        <div className="crop-batches">
          <h3>Your Crop Batches <span className="view-all">View All</span></h3>
          <ul>
            {crops.length === 0 ? (
              <li className="empty">No crop batches yet. Create one using the form.</li>
            ) : (
              crops.map((c, idx) => (
                <li key={c._id || c.id || idx}>
                  <div className="batch-left">
                    <div className="batch-icon">📦</div>
                    <div>
                      <div className="batch-title">{c.cropType || c.type || 'Crop'}</div>
                      <div className="batch-sub">{(c.estimatedWeightKg || c.weight) + ' kg · ' + ((c.storageLocation && (c.storageLocation.division || c.storageLocation.district)) || '')}</div>
                    </div>
                  </div>
                  <div className={`batch-right ${c.risk || c.priority || 'low'}`}>{c.status || c.riskLevel || 'Low'}</div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="tips-today">
          <h3>Tips for Today</h3>
          <ul>
            <li>Check moisture levels in the morning</li>
            <li>Rain expected in 2 days - cover outdoor storage</li>
            <li>Temperature rising - improve ventilation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
