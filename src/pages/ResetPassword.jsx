import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resetToken = (location.state && location.state.resetToken) || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password updated. You can now login.');
        navigate('/login');
      } else {
        const errMsg = data.message || 'Unable to reset password';
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      setError('Network error');
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-start justify-center pt-[96px] md:pt-[120px] pb-8 px-8 bg-[radial-gradient(circle_at_60%_40%,rgba(230,255,242,0.9)_0%,#0a6b3c_100%)] bg-cover">
      <div className="w-full max-w-[420px] bg-gradient-to-b from-white/95 to-[#fafffa] rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-10 flex flex-col items-center">
        <h1 className="text-[2.2rem] font-extrabold text-[#075c3c] m-0">Reset Password</h1>
        <p className="text-[#009e5c] font-medium mb-5 text-base">Enter a new password for your account.</p>

        <form onSubmit={handleSubmit} className="w-full">
          <label className="font-semibold text-[#075c3c] mb-2 block">New Password</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[14px] px-3 py-2 mb-4">
            <input className="bg-transparent outline-none w-full text-[#075c3c] text-base" type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <label className="font-semibold text-[#075c3c] mb-2 block">Confirm Password</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[14px] px-3 py-2 mb-4">
            <input className="bg-transparent outline-none w-full text-[#075c3c] text-base" type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#009e5c] text-white font-bold text-base rounded-[14px] py-3 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        {error && <div className="text-red-600 font-medium mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default ResetPassword;
