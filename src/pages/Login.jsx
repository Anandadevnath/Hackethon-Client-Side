import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, message, setMessage } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginData);
    if (result.ok) {
      // redirect to dashboard
      toast.success(result.data?.message || 'Logged in successfully');
      navigate('/dashboard');
    } else {
      toast.error(result?.data?.message || result?.error?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-start justify-center pt-[96px] md:pt-[120px] pb-8 px-8 bg-[radial-gradient(circle_at_60%_40%,rgba(230,255,242,0.9)_0%,#0a6b3c_100%)] bg-cover">
      <div className="w-full max-w-[420px] bg-gradient-to-b from-white/95 to-[#fafffa] rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-10 flex flex-col items-center">
        <h1 className="text-[2.2rem] font-extrabold text-[#075c3c] m-0">Welcome Back</h1>
        <p className="text-[#009e5c] font-medium mb-5 text-base">Login to HarvestGuard</p>
        <form onSubmit={handleLogin} className="w-full">
          <label className="font-semibold text-[#075c3c] mb-2 block">Email Address</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[14px] px-3 py-2 mb-4">
            <span className="text-lg mr-2 text-[#009e5c]">📧</span>
            <input className="bg-transparent outline-none w-full text-[#075c3c] text-base" type="email" placeholder="farmer@example.com" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
          </div>

          <label className="font-semibold text-[#075c3c] mb-2 block">Password</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[14px] px-3 py-2 mb-4">
            <span className="text-lg mr-2 text-[#009e5c]">🔒</span>
            <input className="bg-transparent outline-none w-full text-[#075c3c] text-base" type="password" placeholder="Password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
          </div>

          <div className="w-full flex justify-end mb-4">
            <Link to="/forgot" className="text-[#009e5c] font-semibold no-underline">Forgot Password?</Link>
          </div>

          <button type="submit" className="w-full bg-[#009e5c] text-white font-bold text-base rounded-[14px] py-3 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">Login to Dashboard</button>
        </form>

        <div className="text-[#075c3c] font-medium mb-3">Don't have an account? <Link to="/register" className="text-[#009e5c] font-semibold underline">Sign Up Free</Link></div>

        <div className="w-full flex items-center my-3">
          <div className="flex-1 h-px bg-[#e7f6ee]"></div>
          <div className="mx-3 text-[#009e5c] font-bold">or</div>
          <div className="flex-1 h-px bg-[#e7f6ee]"></div>
        </div>

        <button className="w-full bg-[#fffbe6] text-[#075c3c] border-2 border-[#7be6b2] flex items-center justify-center gap-2 py-3 rounded-[12px]">🚜 Continue with Demo</button>
        {message && <div className="text-[#009e5c] font-bold mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default Login;
