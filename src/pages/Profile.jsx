import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Sparkles, User, Phone, Image as ImageIcon, MapPin, Globe, KeyRound, Edit3, X, Mail, CheckCircle, Lock, Send, ShieldCheck } from 'lucide-react';
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
  const [otpStatusType, setOtpStatusType] = useState(''); // 'success', 'error', 'info'
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [settingPassword, setSettingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
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
    setOtpStatusType('');
    setSendingOtp(true);
    try {
      const { ok, data } = await api.post('/user/forgot-password', { email: user?.email });
      if (ok) {
        setOtpStatus(data?.message || (isBn ? 'OTP পাঠানো হয়েছে! ইমেইল চেক করুন।' : 'OTP sent! Check your email.'));
        setOtpStatusType('success');
      } else {
        setOtpStatus(data?.message || (isBn ? 'OTP পাঠাতে ব্যর্থ' : 'Failed to send OTP'));
        setOtpStatusType('error');
      }
    } catch (err) {
      setOtpStatus(isBn ? 'নেটওয়ার্ক ত্রুটি' : 'Network error sending OTP');
      setOtpStatusType('error');
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setOtpStatus(isBn ? 'সঠিক OTP লিখুন' : 'Please enter a valid OTP');
      setOtpStatusType('error');
      return;
    }
    setOtpStatus('');
    setOtpStatusType('');
    setVerifyingOtp(true);
    try {
      const { ok, data } = await api.post('/user/verify-otp', { email: user?.email, otp });
      if (ok && data?.resetToken) {
        setResetToken(data.resetToken);
        setOtpStatus(isBn ? 'OTP যাচাই হয়েছে — নতুন পাসওয়ার্ড দিন' : 'OTP verified — enter your new password');
        setOtpStatusType('success');
      } else {
        setOtpStatus(data?.message || (isBn ? 'ভুল OTP' : 'Invalid OTP'));
        setOtpStatusType('error');
      }
    } catch (err) {
      setOtpStatus(isBn ? 'নেটওয়ার্ক ত্রুটি' : 'Network error verifying OTP');
      setOtpStatusType('error');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const submitNewPassword = async () => {
    if (!resetToken) {
      setOtpStatus(isBn ? 'প্রথমে OTP যাচাই করুন' : 'Verify OTP first');
      setOtpStatusType('error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setOtpStatus(isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে' : 'Password must be at least 6 characters');
      setOtpStatusType('error');
      return;
    }
    if (newPassword !== confirmPassword) {
      setOtpStatus(isBn ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match');
      setOtpStatusType('error');
      return;
    }

    setSettingPassword(true);
    try {
      const { ok, data } = await api.post('/user/reset-password', { resetToken, newPassword });
      if (ok) {
        setOtpStatus(data?.message || (isBn ? 'পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!' : 'Password updated successfully!'));
        setOtpStatusType('success');
        toast.success(isBn ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে' : 'Password changed successfully');
        // Reset all states after success
        setTimeout(() => {
          setResetToken(null);
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
          setShowPasswordSection(false);
          setOtpStatus('');
          setOtpStatusType('');
        }, 2000);
      } else {
        setOtpStatus(data?.message || (isBn ? 'পাসওয়ার্ড আপডেট ব্যর্থ' : 'Failed to update password'));
        setOtpStatusType('error');
      }
    } catch (err) {
      setOtpStatus(isBn ? 'নেটওয়ার্ক ত্রুটি' : 'Network error updating password');
      setOtpStatusType('error');
    } finally {
      setSettingPassword(false);
    }
  };

  const resetPasswordFlow = () => {
    setOtp('');
    setResetToken(null);
    setNewPassword('');
    setConfirmPassword('');
    setOtpStatus('');
    setOtpStatusType('');
    setShowPasswordSection(false);
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Change Password Section - Always visible */}
        <div className="mt-8 border-t border-green-200 pt-6">
          {!showPasswordSection ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPasswordSection(true)}
              className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-amber-700 font-semibold hover:from-amber-100 hover:to-orange-100 transition-colors"
            >
              <KeyRound size={20} />
              {isBn ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password'}
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-amber-800 flex items-center gap-2">
                  <KeyRound size={22} /> {isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
                </h2>
                <button 
                  onClick={resetPasswordFlow}
                  className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${!resetToken ? 'bg-amber-600 text-white' : 'bg-green-100 text-green-700'}`}>
                  <Send size={14} />
                  {isBn ? '১. OTP পান' : '1. Get OTP'}
                  {resetToken && <CheckCircle size={14} />}
                </div>
                <div className="w-6 h-0.5 bg-amber-200"></div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${resetToken ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Lock size={14} />
                  {isBn ? '২. নতুন পাসওয়ার্ড' : '2. New Password'}
                </div>
              </div>

              {/* Status Message */}
              {otpStatus && (
                <div className={`mb-4 p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  otpStatusType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
                  otpStatusType === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
                  'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  {otpStatusType === 'success' ? <CheckCircle size={16} /> : 
                   otpStatusType === 'error' ? <X size={16} /> : 
                   <ShieldCheck size={16} />}
                  {otpStatus}
                </div>
              )}

              {!resetToken ? (
                /* Step 1: Request & Verify OTP */
                <div className="space-y-4">
                  <p className="text-sm text-amber-700">
                    {isBn 
                      ? `আমরা আপনার ইমেইলে (${user?.email}) একটি OTP পাঠাব।` 
                      : `We'll send an OTP to your email (${user?.email}).`}
                  </p>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={sendOtp}
                      disabled={sendingOtp}
                      className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl font-medium shadow hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                      {sendingOtp ? (isBn ? 'পাঠানো হচ্ছে...' : 'Sending...') : (isBn ? 'OTP পাঠান' : 'Send OTP')}
                    </button>
                  </div>

                  <div className="pt-3 border-t border-amber-200">
                    <label className="text-amber-800 font-semibold text-sm">{isBn ? 'OTP কোড লিখুন' : 'Enter OTP Code'}</label>
                    <div className="flex gap-3 mt-2">
                      <input 
                        value={otp} 
                        onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                        className="flex-1 p-3 rounded-xl border border-amber-300 bg-white text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-amber-400 focus:border-amber-400" 
                        placeholder="• • • • • •"
                        maxLength={6}
                      />
                      <button 
                        onClick={verifyOtp}
                        disabled={verifyingOtp || !otp}
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium shadow hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShieldCheck size={16} />
                        {verifyingOtp ? (isBn ? 'যাচাই হচ্ছে...' : 'Verifying...') : (isBn ? 'যাচাই করুন' : 'Verify')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Step 2: Set New Password */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 p-3 bg-green-100 text-green-700 rounded-xl text-sm">
                    <CheckCircle size={18} />
                    {isBn ? 'OTP যাচাই সফল! এখন নতুন পাসওয়ার্ড সেট করুন।' : 'OTP verified! Now set your new password.'}
                  </div>

                  <div>
                    <label className="text-amber-800 font-semibold text-sm flex items-center gap-2">
                      <Lock size={16} />
                      {isBn ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                    </label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                      className="w-full p-3 rounded-xl border border-amber-300 bg-white mt-1 focus:ring-2 focus:ring-amber-400 focus:border-amber-400" 
                      placeholder={isBn ? 'কমপক্ষে ৬ অক্ষর' : 'At least 6 characters'}
                    />
                  </div>

                  <div>
                    <label className="text-amber-800 font-semibold text-sm flex items-center gap-2">
                      <ShieldCheck size={16} />
                      {isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
                    </label>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      className="w-full p-3 rounded-xl border border-amber-300 bg-white mt-1 focus:ring-2 focus:ring-amber-400 focus:border-amber-400" 
                      placeholder={isBn ? 'আবার পাসওয়ার্ড লিখুন' : 'Re-enter password'}
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{isBn ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match'}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={submitNewPassword}
                      disabled={settingPassword || !newPassword || newPassword !== confirmPassword}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-bold shadow hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <KeyRound size={18} />
                      {settingPassword ? (isBn ? 'সেট করা হচ্ছে...' : 'Setting...') : (isBn ? 'পাসওয়ার্ড সেট করুন' : 'Set Password')}
                    </button>
                    <button 
                      onClick={resetPasswordFlow}
                      className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
