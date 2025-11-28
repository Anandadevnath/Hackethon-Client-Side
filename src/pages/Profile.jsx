import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, User, Phone, Image as ImageIcon, MapPin, Globe, KeyRound, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, message } = useAuth();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('bn');
  const [district, setDistrict] = useState('');
  const [status, setStatus] = useState('');
  const [otpStatus, setOtpStatus] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setPhone(user.phone || '');
      setPreferredLanguage(user.preferredLanguage || 'bn');
      setDistrict(user.location?.district || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    const updates = { name, avatar };
    if (phone) updates.phone = phone;
    if (preferredLanguage) updates.preferredLanguage = preferredLanguage;
    if (district) updates.location = { district };

    const result = await updateProfile(updates);

    if (result.ok) setStatus('Profile updated successfully ✨');
    else setStatus(result.data?.message || 'Update failed');
  };

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:8000';

  const sendOtp = async () => {
    setOtpStatus('');
    try {
      const res = await fetch(`${API_BASE}/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setOtpStatus(data.message || 'OTP sent! Check your email.');
      else setOtpStatus(data.message || 'Failed to send OTP');
    } catch (err) {
      setOtpStatus('Network error sending OTP');
    }
  };

  const verifyOtp = async () => {
    setOtpStatus('');
    try {
      const res = await fetch(`${API_BASE}/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, otp })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.resetToken) {
        setResetToken(data.resetToken);
        setOtpStatus('OTP verified — enter your new password');
      } else setOtpStatus(data.message || 'Invalid OTP');
    } catch (err) {
      setOtpStatus('Network error verifying OTP');
    }
  };

  const submitNewPassword = async () => {
    if (!resetToken) return setOtpStatus('Verify OTP first');
    if (!newPassword || newPassword.length < 6) return setOtpStatus('Password too short');
    if (newPassword !== confirmPassword) return setOtpStatus('Passwords do not match');

    try {
      const res = await fetch(`${API_BASE}/user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword })
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setOtpStatus(data.message || 'Password updated');
        setResetToken(null);
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else setOtpStatus(data.message || 'Failed to update password');
    } catch (err) {
      setOtpStatus('Network error updating password');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-120px)] flex items-center justify-center p-10 bg-gradient-to-br from-green-50 to-green-200"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-[900px] bg-white rounded-3xl shadow-2xl p-10 border border-green-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-green-600" />
          <h1 className="text-3xl font-extrabold text-green-700">Profile Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-semibold flex items-center gap-2 text-green-700"><User size={18} /> Name</label>
            <input className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div>
            <label className="font-semibold flex items-center gap-2 text-green-700"><Phone size={18} /> Phone</label>
            <input className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>

          <div>
            <label className="font-semibold flex items-center gap-2 text-green-700"><Globe size={18} /> Preferred Language</label>
            <select value={preferredLanguage} onChange={e => setPreferredLanguage(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50">
              <option value="bn">Bengali</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="font-semibold flex items-center gap-2 text-green-700"><MapPin size={18} /> District</label>
            <input className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50" value={district} onChange={e => setDistrict(e.target.value)} />
          </div>

          <div>
            <label className="font-semibold flex items-center gap-2 text-green-700"><ImageIcon size={18} /> Avatar URL</label>
            <input className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50" value={avatar} onChange={e => setAvatar(e.target.value)} />
          </div>

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-md">Save Changes</motion.button>
        </form>

        {status && <p className="text-green-600 font-semibold mt-4">{status}</p>}

        <div className="mt-10 p-6 rounded-2xl bg-green-50 border border-green-200">
          <h2 className="text-xl font-bold text-green-700 flex items-center gap-2 mb-4"><KeyRound /> Change Password</h2>

          <button onClick={sendOtp} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow">Send OTP</button>
          {otpStatus && <p className="text-green-700 mt-2">{otpStatus}</p>}

          <div className="mt-4">
            <label className="text-green-700 font-semibold">Enter OTP</label>
            <input value={otp} onChange={e => setOtp(e.target.value)} className="w-full p-3 mt-1 rounded-xl border border-green-300 bg-green-50" />
            <button onClick={verifyOtp} className="mt-2 px-4 py-2 bg-green-700 text-white rounded-lg shadow">Verify OTP</button>
          </div>

          {resetToken && (
            <div className="mt-5">
              <label className="text-green-700 font-semibold">New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 rounded-xl border border-green-300 bg-green-50 mt-1" />

              <label className="text-green-700 font-semibold mt-3">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 rounded-xl border border-green-300 bg-green-50 mt-1" />

              <button onClick={submitNewPassword} className="mt-3 px-4 py-2 bg-green-700 text-white rounded-lg shadow">Set New Password</button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;