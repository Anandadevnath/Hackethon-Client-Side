import { useState } from "react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:8000/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        const msg = data.message || "If that email exists, a reset link has been sent.";
        setMessage(msg);
        toast.success(msg);
      } else {
        const errMsg = data.message || "Unable to process request.";
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      const errMsg = "Network error. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-start justify-center pt-[96px] md:pt-[120px] pb-8 px-8 bg-[radial-gradient(circle_at_60%_40%,rgba(230,255,242,0.9)_0%,#0a6b3c_100%)] bg-cover">
      <div className="w-full max-w-[420px] bg-gradient-to-b from-white/95 to-[#fafffa] rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-10 flex flex-col items-center">
        <h1 className="text-[2.2rem] font-extrabold text-[#075c3c] m-0">Forgot Password</h1>
        <p className="text-[#009e5c] font-medium mb-5 text-base">Enter your account email to receive reset instructions.</p>

        <form onSubmit={handleSubmit} className="w-full">
          <label className="font-semibold text-[#075c3c] mb-2 block">Email Address</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[14px] px-3 py-2 mb-4">
            <span className="text-lg mr-2 text-[#009e5c]">📧</span>
            <input className="bg-transparent outline-none w-full text-[#075c3c] text-base" type="email" placeholder="farmer@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#009e5c] text-white font-bold text-base rounded-[14px] py-3 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && <div className="text-[#006a3a] font-bold mt-3">{message}</div>}
        {error && <div className="text-red-600 font-medium mt-3">{error}</div>}

        <div className="text-[#075c3c] font-medium mt-6">Remembered? <Link to="/login" className="text-[#009e5c] font-semibold underline">Back to Login</Link></div>
      </div>
    </div>
  );
};

export default ForgotPassword;
