import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Sparkles, User, Phone, Image as ImageIcon, MapPin, Globe, KeyRound, Edit3, X, Mail, CheckCircle } from 'lucide-react';
import bdLocations from '../data/bd-locations.json';

const Profile = () => {
  const { user, updateProfile, message } = useAuth();
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('bn');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [status, setStatus] = useState('');
  const [otpStatus, setOtpStatus] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Get districts based on selected division
  const districts = useMemo(() => {
    if (!division) return [];
    const div = bdLocations.divisions.find(d => d.name === division);
    return div ? div.districts : [];
  }, [division]);

  // Get upazilas based on selected district
  const upazilas = useMemo(() => {
    if (!district || !districts.length) return [];
    const dist = districts.find(d => d.name === district);
    return dist ? dist.upazilas : [];
  }, [district, districts]);

  // Handle division change - reset district and upazila
  const handleDivisionChange = (e) => {
    setDivision(e.target.value);
    setDistrict('');
    setUpazila('');
  };

  // Handle district change - reset upazila
  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
    setUpazila('');
  };

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setPhone(user.phone || '');
      setPreferredLanguage(user.preferredLanguage || 'bn');
      setDivision(user.location?.division || '');
      setDistrict(user.location?.district || '');
      setUpazila(user.location?.upazila || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    const updates = { name, avatar };
    if (phone) updates.phone = phone;
    if (preferredLanguage) updates.preferredLanguage = preferredLanguage;
    if (division || district || upazila) {
      updates.location = {
        division: division || '',
        district: district || '',
        upazila: upazila || ''
      };
    }

    const result = await updateProfile(updates);

    if (result.ok) {
      setStatus('Profile updated successfully ✨');
      toast.success(result.data?.message || 'Profile updated successfully ✨');
      setIsEditing(false);
    } else {
      const msg = result.data?.message || 'Update failed';
      setStatus(msg);
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    // Reset form to user data
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setPhone(user.phone || '');
      setPreferredLanguage(user.preferredLanguage || 'bn');
      setDivision(user.location?.division || '');
      setDistrict(user.location?.district || '');
      setUpazila(user.location?.upazila || '');
    }
    setIsEditing(false);
    setStatus('');
  };

  const sendOtp = async () => {
    setOtpStatus('');
    try {
      const { ok, data } = await api.post('/user/forgot-password', { email: user?.email });
      if (ok) setOtpStatus(data?.message || (isBn ? 'OTP পাঠানো হয়েছে! ইমেইল চেক করুন।' : 'OTP sent! Check your email.'));
      else setOtpStatus(data?.message || (isBn ? 'OTP পাঠাতে ব্যর্থ' : 'Failed to send OTP'));
    } catch (err) {
      setOtpStatus(isBn ? 'নেটওয়ার্ক ত্রুটি' : 'Network error sending OTP');
    }
  };

  const verifyOtp = async () => {
    setOtpStatus('');
    try {
      const { ok, data } = await api.post('/user/verify-otp', { email: user?.email, otp });
      if (ok && data?.resetToken) {
        setResetToken(data.resetToken);
        setOtpStatus(isBn ? 'OTP যাচাই হয়েছে — নতুন পাসওয়ার্ড দিন' : 'OTP verified — enter your new password');
      } else setOtpStatus(data?.message || (isBn ? 'ভুল OTP' : 'Invalid OTP'));
    } catch (err) {
      setOtpStatus(isBn ? 'নেটওয়ার্ক ত্রুটি' : 'Network error verifying OTP');
    }
  };

  const submitNewPassword = async () => {
    if (!resetToken) return setOtpStatus(isBn ? 'প্রথমে OTP যাচাই করুন' : 'Verify OTP first');
    if (!newPassword || newPassword.length < 6) return setOtpStatus(isBn ? 'পাসওয়ার্ড খুব ছোট' : 'Password too short');
    if (newPassword !== confirmPassword) return setOtpStatus(isBn ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match');

    try {
      const { ok, data } = await api.post('/user/reset-password', { resetToken, newPassword });
      if (ok) {
        setOtpStatus(data?.message || (isBn ? 'পাসওয়ার্ড আপডেট হয়েছে' : 'Password updated'));
        toast.success(isBn ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে' : 'Password changed successfully');
        setResetToken(null);
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else setOtpStatus(data?.message || (isBn ? 'পাসওয়ার্ড আপডেট ব্যর্থ' : 'Failed to update password'));
    } catch (err) {
      setOtpStatus(isBn ? 'নেটওয়ার্ক ত্রুটি' : 'Network error updating password');
    }
  };

  // Get display values for location
  const getLocationDisplay = () => {
    const parts = [];
    if (upazila) parts.push(upazila);
    if (district) parts.push(district);
    if (division) parts.push(division);
    return parts.length > 0 ? parts.join(', ') : (isBn ? 'নির্ধারিত নয়' : 'Not set');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-120px)] flex items-center justify-center pt-[96px] md:pt-[120px] p-6 md:p-10 bg-gradient-to-br from-green-50 to-green-200"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-[900px] bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-green-200"
      >
        {/* Header with Edit Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-green-600" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-green-700">
              {isEditing ? (isBn ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile') : (isBn ? 'আমার প্রোফাইল' : 'My Profile')}
            </h1>
          </div>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:bg-green-700 transition-colors"
            >
              <Edit3 size={18} />
              <span className="hidden sm:inline">{isBn ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile'}</span>
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!isEditing ? (
            /* VIEW MODE */
            <motion.div
              key="view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Profile Card */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Avatar */}
                <div className="flex-shrink-0 flex justify-center">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-lg" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                      {name ? name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-1">
                        <User size={16} />
                        {isBn ? 'নাম' : 'Name'}
                      </div>
                      <div className="text-green-800 font-semibold text-lg">{name || (isBn ? 'নির্ধারিত নয়' : 'Not set')}</div>
                    </div>

                    {/* Email */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-1">
                        <Mail size={16} />
                        {isBn ? 'ইমেইল' : 'Email'}
                      </div>
                      <div className="text-green-800 font-semibold text-lg break-all">{user?.email || (isBn ? 'নির্ধারিত নয়' : 'Not set')}</div>
                    </div>

                    {/* Phone */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-1">
                        <Phone size={16} />
                        {isBn ? 'ফোন' : 'Phone'}
                      </div>
                      <div className="text-green-800 font-semibold text-lg">{phone || (isBn ? 'নির্ধারিত নয়' : 'Not set')}</div>
                    </div>

                    {/* Language */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-1">
                        <Globe size={16} />
                        {isBn ? 'পছন্দের ভাষা' : 'Preferred Language'}
                      </div>
                      <div className="text-green-800 font-semibold text-lg">{preferredLanguage === 'bn' ? 'বাংলা' : 'English'}</div>
                    </div>

                    {/* Location - Full Width */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100 md:col-span-2">
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-1">
                        <MapPin size={16} />
                        {isBn ? 'অবস্থান' : 'Location'}
                      </div>
                      <div className="text-green-800 font-semibold text-lg">{getLocationDisplay()}</div>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className={`flex items-center gap-2 p-3 rounded-xl ${user?.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    <CheckCircle size={20} />
                    <span className="font-medium">
                      {user?.isVerified 
                        ? (isBn ? 'যাচাইকৃত অ্যাকাউন্ট' : 'Verified Account') 
                        : (isBn ? 'অযাচাইকৃত অ্যাকাউন্ট' : 'Unverified Account')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* EDIT MODE */
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold flex items-center gap-2 text-green-700"><User size={18} /> {isBn ? 'নাম' : 'Name'}</label>
                    <input className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50" value={name} onChange={e => setName(e.target.value)} required />
                  </div>

                  <div>
                    <label className="font-semibold flex items-center gap-2 text-green-700"><Phone size={18} /> {isBn ? 'ফোন' : 'Phone'}</label>
                    <input className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="font-semibold flex items-center gap-2 text-green-700"><Globe size={18} /> {isBn ? 'পছন্দের ভাষা' : 'Preferred Language'}</label>
                  <select value={preferredLanguage} onChange={e => setPreferredLanguage(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50 cursor-pointer">
                    <option value="bn">{isBn ? 'বাংলা' : 'Bengali'}</option>
                    <option value="en">{isBn ? 'ইংরেজি' : 'English'}</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Division */}
                  <div>
                    <label className="font-semibold flex items-center gap-2 text-green-700"><MapPin size={18} /> {isBn ? 'বিভাগ' : 'Division'}</label>
                    <select 
                      className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50 cursor-pointer"
                      value={division}
                      onChange={handleDivisionChange}
                    >
                      <option value="">{isBn ? '-- নির্বাচন করুন --' : '-- Select --'}</option>
                      {bdLocations.divisions.map(div => (
                        <option key={div.name} value={div.name}>
                          {isBn ? div.nameBn : div.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="font-semibold flex items-center gap-2 text-green-700"><MapPin size={18} /> {isBn ? 'জেলা' : 'District'}</label>
                    <select 
                      className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      value={district}
                      onChange={handleDistrictChange}
                      disabled={!division}
                    >
                      <option value="">{isBn ? '-- নির্বাচন করুন --' : '-- Select --'}</option>
                      {districts.map(dist => (
                        <option key={dist.name} value={dist.name}>
                          {isBn ? dist.nameBn : dist.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upazila */}
                  <div>
                    <label className="font-semibold flex items-center gap-2 text-green-700"><MapPin size={18} /> {isBn ? 'উপজেলা' : 'Upazila'}</label>
                    <select 
                      className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      value={upazila}
                      onChange={e => setUpazila(e.target.value)}
                      disabled={!district}
                    >
                      <option value="">{isBn ? '-- নির্বাচন করুন --' : '-- Select --'}</option>
                      {upazilas.map(upz => (
                        <option key={upz} value={upz}>{upz}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold flex items-center gap-2 text-green-700"><ImageIcon size={18} /> {isBn ? 'অবতার URL' : 'Avatar URL'}</label>
                  <input className="w-full mt-1 p-3 rounded-xl border border-green-300 bg-green-50" value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://example.com/avatar.jpg" />
                </div>

                <div className="flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    type="submit" 
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-md hover:bg-green-700 transition-colors"
                  >
                    {isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold shadow-md hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <X size={18} />
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </motion.button>
                </div>
              </form>

              {status && <p className="text-green-600 font-semibold mt-4">{status}</p>}

              {/* Change Password Section */}
              <div className="mt-10 p-6 rounded-2xl bg-green-50 border border-green-200">
                <h2 className="text-xl font-bold text-green-700 flex items-center gap-2 mb-4">
                  <KeyRound /> {isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
                </h2>

                <button onClick={sendOtp} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors">
                  {isBn ? 'OTP পাঠান' : 'Send OTP'}
                </button>
                {otpStatus && <p className="text-green-700 mt-2 font-medium">{otpStatus}</p>}

                <div className="mt-4">
                  <label className="text-green-700 font-semibold">{isBn ? 'OTP লিখুন' : 'Enter OTP'}</label>
                  <input value={otp} onChange={e => setOtp(e.target.value)} className="w-full p-3 mt-1 rounded-xl border border-green-300 bg-white" placeholder="000000" />
                  <button onClick={verifyOtp} className="mt-2 px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition-colors">
                    {isBn ? 'OTP যাচাই করুন' : 'Verify OTP'}
                  </button>
                </div>

                {resetToken && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-5 space-y-3"
                  >
                    <div>
                      <label className="text-green-700 font-semibold">{isBn ? 'নতুন পাসওয়ার্ড' : 'New Password'}</label>
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 rounded-xl border border-green-300 bg-white mt-1" />
                    </div>

                    <div>
                      <label className="text-green-700 font-semibold">{isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</label>
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 rounded-xl border border-green-300 bg-white mt-1" />
                    </div>

                    <button onClick={submitNewPassword} className="px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition-colors">
                      {isBn ? 'নতুন পাসওয়ার্ড সেট করুন' : 'Set New Password'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
