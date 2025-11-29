import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, message, setMessage } = useAuth();
  const { lang } = useLanguage();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const isBn = lang === 'bn';

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginData);
    if (result.ok) {
      // redirect to dashboard
      toast.success(result.data?.message || (isBn ? 'সফলভাবে লগইন হয়েছে' : 'Logged in successfully'));
      navigate('/dashboard');
    } else {
      toast.error(result?.data?.message || result?.error?.message || (isBn ? 'লগইন ব্যর্থ হয়েছে' : 'Login failed'));
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-start justify-center pt-[96px] md:pt-[120px] pb-8 px-8 bg-[radial-gradient(circle_at_60%_40%,rgba(230,255,242,0.9)_0%,#0a6b3c_100%)] bg-cover">
      <div className="w-full max-w-[420px] bg-gradient-to-b from-white/95 to-[#fafffa] rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-10 flex flex-col items-center">
        <h1 className="text-[2.2rem] font-extrabold text-[#075c3c] m-0">{isBn ? 'আবার স্বাগতম' : 'Welcome Back'}</h1>
        <p className="text-[#009e5c] font-medium mb-5 text-base">{isBn ? 'হার্ভেস্টগার্ডে লগইন করুন' : 'Login to HarvestGuard'}</p>
        <form onSubmit={handleLogin} className="w-full">
          <label className="font-semibold text-[#075c3c] mb-2 block">{isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[14px] px-3 py-2 mb-4">
            <span className="text-lg mr-2 text-[#009e5c]">📧</span>
            <input className="bg-transparent outline-none w-full text-[#075c3c] text-base" type="email" placeholder={isBn ? 'farmer@example.com' : 'farmer@example.com'} value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
          </div>

          <label className="font-semibold text-[#075c3c] mb-2 block">{isBn ? 'পাসওয়ার্ড' : 'Password'}</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[14px] px-3 py-2 mb-4">
            <span className="text-lg mr-2 text-[#009e5c]">🔒</span>
            <input className="bg-transparent outline-none w-full text-[#075c3c] text-base" type="password" placeholder={isBn ? 'পাসওয়ার্ড' : 'Password'} value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
          </div>

          <div className="w-full flex justify-end mb-4">
            <Link to="/forgot" className="text-[#009e5c] font-semibold no-underline">{isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}</Link>
          </div>

          <button type="submit" className="w-full bg-[#009e5c] text-white font-bold text-base rounded-[14px] py-3 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">{isBn ? 'ড্যাশবোর্ডে লগইন করুন' : 'Login to Dashboard'}</button>
        </form>

        <div className="text-[#075c3c] font-medium mb-3">{isBn ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"} <Link to="/register" className="text-[#009e5c] font-semibold underline">{isBn ? 'বিনামূল্যে সাইন আপ করুন' : 'Sign Up Free'}</Link></div>
        {message && <div className="text-[#009e5c] font-bold mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default Login;
