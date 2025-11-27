
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, message, setMessage } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginData);
    if (result.ok) {
      // redirect to dashboard or home
      navigate('/');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-sub">Login to HarvestGuard</p>
        <form onSubmit={handleLogin} className="auth-form">
          <label>Email Address</label>
          <div className="auth-input-wrap">
            <span className="auth-icon">📧</span>
            <input type="email" placeholder="farmer@example.com" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
          </div>
          <label>Password</label>
          <div className="auth-input-wrap">
            <span className="auth-icon">🔒</span>
            <input type="password" placeholder="Password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
          </div>
          <div className="auth-row">
            <span></span>
            <a href="#" className="auth-link">Forgot Password?</a>
          </div>
          <button type="submit" className="auth-btn">Login to Dashboard</button>
        </form>
        <div className="auth-bottom">
          <span>Don't have an account? <Link to="/register" className="auth-link">Sign Up Free</Link></span>
        </div>
        <div className="auth-or"><span>or</span></div>
        <button className="auth-btn demo-btn">🚜 Continue with Demo</button>
        {message && <div className="auth-message">{message}</div>}
      </div>
    </div>
  );
};

export default Login;
