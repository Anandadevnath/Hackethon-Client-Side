import React, { useState, useMemo } from "react";
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import bdLocations from '../data/bd-locations.json';

const Register = () => {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

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

  // Get districts based on selected division
  const districts = useMemo(() => {
    if (!registerData.division) return [];
    const division = bdLocations.divisions.find(d => d.name === registerData.division);
    return division ? division.districts : [];
  }, [registerData.division]);

  // Get upazilas based on selected district
  const upazilas = useMemo(() => {
    if (!registerData.district || !districts.length) return [];
    const district = districts.find(d => d.name === registerData.district);
    return district ? district.upazilas : [];
  }, [registerData.district, districts]);

  // Handle division change - reset district and upazila
  const handleDivisionChange = (e) => {
    setRegisterData({ 
      ...registerData, 
      division: e.target.value, 
      district: "", 
      upazila: "" 
    });
  };

  // Handle district change - reset upazila
  const handleDistrictChange = (e) => {
    setRegisterData({ 
      ...registerData, 
      district: e.target.value, 
      upazila: "" 
    });
  };

  const { register, message: authMessage } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    if (registerData.password !== registerData.confirmPassword) {
      const msg = isBn ? "পাসওয়ার্ড মিলছে না।" : "Passwords do not match.";
      setMessage(msg);
      toast.error(msg);
      return;
    }
    if (!registerData.agree) {
      const msg = isBn ? "আপনাকে শর্তাবলীতে সম্মত হতে হবে।" : "You must agree to the terms.";
      setMessage(msg);
      toast.error(msg);
      return;
    }
    const payload = { ...registerData };
    const langPref = (registerData.language || '').toString().toLowerCase();
    payload.preferredLanguage = (langPref === 'english' || langPref === 'en') ? 'en' : (langPref === 'bangla' || langPref === 'bn') ? 'bn' : 'en';

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
      toast.success(result.data?.message || (isBn ? 'সফলভাবে নিবন্ধন হয়েছে' : 'Registered successfully'));
      navigate('/login');
    } else {
      // Improved error display
      const errorMsg = result?.data?.message || result?.data?.errors?.join(', ') || result?.error?.message || (isBn ? 'নিবন্ধন ব্যর্থ হয়েছে' : 'Registration failed');
      toast.error(errorMsg);
      setMessage(errorMsg); // Also update local message state for display
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-start justify-center pt-[96px] md:pt-[120px] pb-8 px-8 bg-[radial-gradient(circle_at_60%_40%,rgba(230,255,242,0.9)_0%,#0a6b3c_100%)]">
      <div className="w-full max-w-[920px] bg-gradient-to-b from-white/95 to-[#fafffa] rounded-[22px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-9 flex flex-col items-center">
        <h1 className="text-[2.2rem] font-extrabold text-[#075c3c] m-0">{isBn ? 'আপনার অ্যাকাউন্ট তৈরি করুন' : 'Create Your Account'}</h1>
        <p className="text-[#009e5c] font-medium mb-5">{isBn ? 'হাজার হাজার কৃষকের সাথে যোগ দিন যারা তাদের ফসল রক্ষা করছে' : 'Join thousands of farmers protecting their harvest'}</p>
        <form onSubmit={handleRegister} className="w-full">
          <div className="flex flex-col md:flex-row gap-4 w-full mb-3">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">{isBn ? 'পুরো নাম' : 'Full Name'}</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">👤</span>
                <input className="bg-transparent outline-none w-full text-[#075c3c]" type="text" placeholder={isBn ? 'আপনার নাম' : 'Your name'} value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} required />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">{isBn ? 'ফোন নম্বর' : 'Phone Number'}</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">📞</span>
                <input className="bg-transparent outline-none w-full text-[#075c3c]" type="text" placeholder="+880 1XXX-XXXXXX" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} required />
              </div>
            </div>
          </div>

          <label className="font-semibold text-[#075c3c] mb-2">{isBn ? 'ইমেইল ঠিকানা (ঐচ্ছিক)' : 'Email Address (Optional)'}</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
            <span className="text-lg mr-2 text-[#009e5c]">📧</span>
            <input className="bg-transparent outline-none w-full text-[#075c3c]" type="email" placeholder="farmer@example.com" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full mb-3">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">{isBn ? 'বিভাগ' : 'Division'}</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">📍</span>
                <select 
                  className="bg-transparent outline-none w-full text-[#075c3c] cursor-pointer" 
                  value={registerData.division} 
                  onChange={handleDivisionChange} 
                  required
                >
                  <option value="">{isBn ? '-- বিভাগ নির্বাচন করুন --' : '-- Select Division --'}</option>
                  {bdLocations.divisions.map(div => (
                    <option key={div.name} value={div.name}>
                      {isBn ? div.nameBn : div.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">{isBn ? 'জেলা' : 'District'}</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">📍</span>
                <select 
                  className="bg-transparent outline-none w-full text-[#075c3c] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                  value={registerData.district} 
                  onChange={handleDistrictChange} 
                  disabled={!registerData.division}
                  required
                >
                  <option value="">{isBn ? '-- জেলা নির্বাচন করুন --' : '-- Select District --'}</option>
                  {districts.map(dist => (
                    <option key={dist.name} value={dist.name}>
                      {isBn ? dist.nameBn : dist.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full mb-3">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">{isBn ? 'উপজেলা' : 'Upazila'}</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">📍</span>
                <select 
                  className="bg-transparent outline-none w-full text-[#075c3c] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                  value={registerData.upazila} 
                  onChange={e => setRegisterData({ ...registerData, upazila: e.target.value })} 
                  disabled={!registerData.district}
                  required
                >
                  <option value="">{isBn ? '-- উপজেলা নির্বাচন করুন --' : '-- Select Upazila --'}</option>
                  {upazilas.map(upz => (
                    <option key={upz} value={upz}>{upz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <label className="font-semibold text-[#075c3c] mb-2">{isBn ? 'পছন্দের ভাষা' : 'Preferred Language'}</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
            <span className="text-lg mr-2 text-[#009e5c]">🌐</span>
            <select className="bg-transparent outline-none w-full text-[#075c3c] cursor-pointer" value={registerData.language} onChange={e => setRegisterData({ ...registerData, language: e.target.value })} required>
              <option value="English">{isBn ? 'ইংরেজি' : 'English'}</option>
              <option value="Bangla">{isBn ? 'বাংলা' : 'Bangla'}</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full mb-3">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">{isBn ? 'পাসওয়ার্ড' : 'Password'}</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">🔒</span>
                <input className="bg-transparent outline-none w-full text-[#075c3c]" type="password" placeholder={isBn ? 'পাসওয়ার্ড' : 'Password'} value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="font-semibold text-[#075c3c] mb-2">{isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</label>
              <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
                <span className="text-lg mr-2 text-[#009e5c]">🔒</span>
                <input className="bg-transparent outline-none w-full text-[#075c3c]" type="password" placeholder={isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'} value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} required />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#fff2cc] border rounded-[8px] p-3 mb-3">
            <input className="mt-1" type="checkbox" checked={registerData.agree} onChange={e => setRegisterData({ ...registerData, agree: e.target.checked })} required />
            <span className="text-sm">{isBn ? 'আমি সেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত। আমি বুঝি আমার তথ্য সুরক্ষিত ও গোপনীয় থাকবে।' : 'I agree to the Terms of Service and Privacy Policy. I understand my data will be kept secure and private.'}</span>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-[#075c3c] to-[#009e5c] text-white font-bold text-base rounded-[12px] py-3">{isBn ? 'অ্যাকাউন্ট তৈরি করুন ও সুরক্ষা শুরু করুন' : 'Create Account & Start Protecting'}</button>
        </form>

        <div className="mt-4 text-[#075c3c]">{isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'} <a href="/login" className="underline text-[#075c3c]">{isBn ? 'এখানে লগইন করুন' : 'Login Here'}</a></div>

        <div className="mt-4 p-3 rounded text-black bg-white/5 w-full text-center">{isBn ? '📞 সাইন আপে সাহায্য প্রয়োজন? আমাদের কৃষক সহায়তা হটলাইনে কল করুন: ১৬১২৩ (২৪/৭)' : '📞 Need help signing up? Call our farmer support hotline: 16123 (24/7)'}</div>
        {message && <div className="text-[#009e5c] font-bold mt-3">{message}</div>}
        {authMessage && <div className="text-[#009e5c] font-bold mt-3">{authMessage}</div>}
      </div>
    </div>
  );
};

export default Register;
