import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = "http://localhost:8000"; 

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
      toast.error("Passwords do not match.");
      return;
    }
    if (!registerData.agree) {
      setMessage("You must agree to the terms.");
      toast.error("You must agree to the terms.");
      return;
    }
    const payload = { ...registerData };
    const lang = (registerData.language || '').toString().toLowerCase();
    payload.preferredLanguage = (lang === 'english' || lang === 'en') ? 'en' : (lang === 'bangla' || lang === 'bn') ? 'bn' : 'en';

    payload.location = {
      division: registerData.division || '',
      district: registerData.district || '',
      upazila: registerData.upazila || ''
    };
    delete payload.division;
    delete payload.district;
    delete payload.upazila;
    delete payload.language;

    const result = await register(payload);
    if (result.ok) {
      // on success, navigate to login
      toast.success(result.data?.message || 'Registered successfully');
      navigate('/login');
    } else {
      toast.error(result?.data?.message || result?.error?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-start justify-center pt-[96px] md:pt-[120px] pb-8 px-8 bg-[radial-gradient(circle_at_60%_40%,rgba(230,255,242,0.9)_0%,#0a6b3c_100%)]">
      <div className="w-full max-w-[920px] bg-gradient-to-b from-white/95 to-[#fafffa] rounded-[22px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-9 flex flex-col items-center">
        <h1 className="text-[2.2rem] font-extrabold text-[#075c3c] m-0">Create Your Account</h1>
        <p className="text-[#009e5c] font-medium mb-5">Join thousands of farmers protecting their harvest</p>
        <form onSubmit={handleRegister} className="w-full">
          <div className="flex flex-col md:flex-row gap-4 w-full mb-3">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">Full Name</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">👤</span>
                <input className="bg-transparent outline-none w-full text-[#075c3c]" type="text" placeholder="Your name" value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} required />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">Phone Number</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">📞</span>
                <input className="bg-transparent outline-none w-full text-[#075c3c]" type="text" placeholder="+880 1XXX-XXXXXX" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} required />
              </div>
            </div>
          </div>

          <label className="font-semibold text-[#075c3c] mb-2">Email Address (Optional)</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
            <span className="text-lg mr-2 text-[#009e5c]">📧</span>
            <input className="bg-transparent outline-none w-full text-[#075c3c]" type="email" placeholder="farmer@example.com" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full mb-3">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">Division</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">📍</span>
                <input className="bg-transparent outline-none w-full text-[#075c3c]" type="text" placeholder="Select Division" value={registerData.division} onChange={e => setRegisterData({ ...registerData, division: e.target.value })} required />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">District</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">📍</span>
                <input className="bg-transparent outline-none w-full text-[#075c3c]" type="text" placeholder="Select District" value={registerData.district} onChange={e => setRegisterData({ ...registerData, district: e.target.value })} required />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full mb-3">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">Upazila</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">📍</span>
                <input className="bg-transparent outline-none w-full text-[#075c3c]" type="text" placeholder="Select Upazila" value={registerData.upazila} onChange={e => setRegisterData({ ...registerData, upazila: e.target.value })} required />
              </div>
            </div>
          </div>

          <label className="font-semibold text-[#075c3c] mb-2">Preferred Language</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
            <span className="text-lg mr-2 text-[#009e5c]">🌐</span>
            <input className="bg-transparent outline-none w-full text-[#075c3c]" type="text" placeholder="English" value={registerData.language} onChange={e => setRegisterData({ ...registerData, language: e.target.value })} required />
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full mb-3">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">Password</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">🔒</span>
                <input className="bg-transparent outline-none w-full text-[#075c3c]" type="password" placeholder="Password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">Confirm Password</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">🔒</span>
                <input className="bg-transparent outline-none w-full text-[#075c3c]" type="password" placeholder="Confirm Password" value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} required />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#fff2cc] border rounded-[8px] p-3 mb-3">
            <input className="mt-1" type="checkbox" checked={registerData.agree} onChange={e => setRegisterData({ ...registerData, agree: e.target.checked })} required />
            <span className="text-sm">I agree to the Terms of Service and Privacy Policy. I understand my data will be kept secure and private.</span>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-[#075c3c] to-[#009e5c] text-white font-bold text-base rounded-[12px] py-3">Create Account & Start Protecting</button>
        </form>

        <div className="mt-4 text-[#075c3c]">Already have an account? <a href="/login" className="underline text-[#075c3c]">Login Here</a></div>

        <button className="w-full mt-4 bg-[#fffbe6] text-[#075c3c] border-2 border-[#7be6b2] px-4 py-3 rounded-[12px]">🚜 Continue with Demo</button>
        <div className="mt-4 p-3 rounded text-white bg-white/5 w-full text-center">📞 Need help signing up? Call our farmer support hotline: 16123 (24/7)</div>
        {message && <div className="text-[#009e5c] font-bold mt-3">{message}</div>}
        {authMessage && <div className="text-[#009e5c] font-bold mt-3">{authMessage}</div>}
      </div>
    </div>
  );
};

export default Register;
