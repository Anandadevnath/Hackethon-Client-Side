import React, { useState } from "react";
import "./Register.css";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:5000"; // Change if your backend runs elsewhere

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    email: "",
    division: "",
    district: "",
    upazila: "",
    language: "English",
    password: "",
    confirmPassword: "",
    agree: false
  });
  const [message, setMessage] = useState("");

  const { register, message: authMessage } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    if (registerData.password !== registerData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (!registerData.agree) {
      setMessage("You must agree to the terms.");
      return;
    }
    // Build payload to match server expectation:
    // map free-text language to `preferredLanguage` ('en'|'bn') and include nested `location` object
    const payload = { ...registerData };
    const lang = (registerData.language || '').toString().toLowerCase();
    payload.preferredLanguage = (lang === 'english' || lang === 'en') ? 'en' : (lang === 'bangla' || lang === 'bn') ? 'bn' : 'en';

    payload.location = {
      division: registerData.division || '',
      district: registerData.district || '',
      upazila: registerData.upazila || ''
    };
    // Remove flat fields so server receives expected shape
    delete payload.division;
    delete payload.district;
    delete payload.upazila;
    delete payload.language;

    const result = await register(payload);
    if (result.ok) {
      // on success, navigate to login
      navigate('/login');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h1>Create Your Account</h1>
        <p className="auth-sub">Join thousands of farmers protecting their harvest</p>
        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-row">
            <div className="auth-col">
              <label>Full Name</label>
              <div className="auth-input-wrap">
                <span className="auth-icon">👤</span>
                <input type="text" placeholder="Your name" value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} required />
              </div>
            </div>
            <div className="auth-col">
              <label>Phone Number</label>
              <div className="auth-input-wrap">
                <span className="auth-icon">📞</span>
                <input type="text" placeholder="+880 1XXX-XXXXXX" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} required />
              </div>
            </div>
          </div>
          <label>Email Address (Optional)</label>
          <div className="auth-input-wrap">
            <span className="auth-icon">📧</span>
            <input type="email" placeholder="farmer@example.com" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
          </div>
          <div className="auth-row">
            <div className="auth-col">
              <label>Division</label>
              <div className="auth-input-wrap">
                <span className="auth-icon">📍</span>
                <input type="text" placeholder="Select Division" value={registerData.division} onChange={e => setRegisterData({ ...registerData, division: e.target.value })} required />
              </div>
            </div>
            <div className="auth-col">
              <label>District</label>
              <div className="auth-input-wrap">
                <span className="auth-icon">📍</span>
                <input type="text" placeholder="Select District" value={registerData.district} onChange={e => setRegisterData({ ...registerData, district: e.target.value })} required />
              </div>
            </div>
          </div>
          <div className="auth-row">
            <div className="auth-col">
              <label>Upazila</label>
              <div className="auth-input-wrap">
                <span className="auth-icon">📍</span>
                <input type="text" placeholder="Select Upazila" value={registerData.upazila} onChange={e => setRegisterData({ ...registerData, upazila: e.target.value })} required />
              </div>
            </div>
          </div>
          <label>Preferred Language</label>
          <div className="auth-input-wrap">
            <span className="auth-icon">🌐</span>
            <input type="text" placeholder="English" value={registerData.language} onChange={e => setRegisterData({ ...registerData, language: e.target.value })} required />
          </div>
          <div className="auth-row">
            <div className="auth-col">
              <label>Password</label>
              <div className="auth-input-wrap">
                <span className="auth-icon">🔒</span>
                <input type="password" placeholder="Password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required />
              </div>
            </div>
            <div className="auth-col">
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-icon">🔒</span>
                <input type="password" placeholder="Confirm Password" value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} required />
              </div>
            </div>
          </div>
          <div className="auth-checkbox-row">
            <input type="checkbox" checked={registerData.agree} onChange={e => setRegisterData({ ...registerData, agree: e.target.checked })} required />
            <span>I agree to the Terms of Service and Privacy Policy. I understand my data will be kept secure and private.</span>
          </div>
          <button type="submit" className="auth-btn">Create Account & Start Protecting</button>
        </form>
        <div className="auth-bottom">
          <span>Already have an account? <a href="/login" className="auth-link">Login Here</a></span>
        </div>
        <button className="auth-btn demo-btn">🚜 Continue with Demo</button>
        <div className="auth-support">📞 Need help signing up? Call our farmer support hotline: 16123 (24/7)</div>
        {message && <div className="auth-message">{message}</div>}
        {authMessage && <div className="auth-message">{authMessage}</div>}
      </div>
    </div>
  );
};

export default Register;
