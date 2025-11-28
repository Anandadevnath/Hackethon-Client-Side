import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, message } = useAuth();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const result = await updateProfile({ name, avatar });
    if (result.ok) {
      setStatus('Profile updated');
      // optional: navigate to dashboard
      // navigate('/dashboard')
    } else {
      setStatus(result.data?.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-8 bg-[radial-gradient(circle_at_60%_40%,rgba(230,255,242,0.9)_0%,#0a6b3c_100%)]">
      <div className="w-full max-w-[920px] bg-gradient-to-b from-white/95 to-[#fafffa] rounded-[22px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-9 flex flex-col items-center">
        <h1 className="text-[2.2rem] font-extrabold text-[#075c3c] m-0">Your Profile</h1>
        <form onSubmit={handleSubmit} className="w-full mt-4">
          <label className="font-semibold text-[#075c3c] mb-2">Display Name</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
            <input className="bg-transparent outline-none w-full text-[#075c3c]" type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <label className="font-semibold text-[#075c3c] mb-2">Avatar URL (optional)</label>
          <div className="flex items-center bg-white border-2 border-[#7be6b2] rounded-[12px] px-3 py-2 mb-3">
            <input className="bg-transparent outline-none w-full text-[#075c3c]" type="url" placeholder="https://..." value={avatar} onChange={e => setAvatar(e.target.value)} />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-[#075c3c] to-[#009e5c] text-white font-bold text-base rounded-[12px] py-3">Save Profile</button>
        </form>
        {(status || message) && <div className="text-[#009e5c] font-bold mt-3">{status || message}</div>}
      </div>
    </div>
  );
};

export default Profile;
