import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefilledEmail = (location.state && location.state.email) || '';

  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { ok, data } = await api.post('/user/verify-otp', { email, otp });
      if (ok) {
        const token = data?.resetToken;
        toast.success('OTP verified — proceed to reset password');
        navigate('/reset-password', { state: { resetToken: token } });
      } else {
        const errMsg = (data && data.message) || 'Invalid OTP';
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      const errMsg = 'Network error. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-start justify-center pt-[96px] md:pt-[120px] pb-8 px-8 bg-[radial-gradient(circle_at_60%_40%,rgba(230,255,242,0.9)_0%,#0a6b3c_100%)] bg-cover">
      <div className="w-full max-w-[420px] bg-gradient-to-b from-white/95 to-[#fafffa] rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-10 flex flex-col items-center">
        <h1 className="text-[2.2rem] font-extrabold text-[#075c3c] m-0">Verify OTP</h1>
        <p className="text-[#009e5c] font-medium mb-5 text-base">Enter the code sent to your email to continue.</p>

        <form onSubmit={handleSubmit} className="w-full">
          <label className="font-semibold text-[#075c3c] mb-2 block">Email Address</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[14px] px-3 py-2 mb-4">
            <input className="bg-transparent outline-none w-full text-[#075c3c] text-base" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <label className="font-semibold text-[#075c3c] mb-2 block">OTP Code</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[14px] px-3 py-2 mb-4">
            <input className="bg-transparent outline-none w-full text-[#075c3c] text-base" type="text" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#009e5c] text-white font-bold text-base rounded-[14px] py-3 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        {error && <div className="text-red-600 font-medium mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default Verify;
