import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Register.css';
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
    <div className="auth-bg">
      <div className="auth-card">
        <h1>Your Profile</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Display Name</label>
          <div className="auth-input-wrap">
            <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <label>Avatar URL (optional)</label>
          <div className="auth-input-wrap">
            <input type="url" placeholder="https://..." value={avatar} onChange={e => setAvatar(e.target.value)} />
          </div>

          <button type="submit" className="auth-btn">Save Profile</button>
        </form>
        {(status || message) && <div className="auth-message">{status || message}</div>}
      </div>
    </div>
  );
};

export default Profile;
