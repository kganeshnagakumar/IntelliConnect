import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './LoginScreen.css';
import backgroundImage from '../../assets/login-background-img.png';
import logoImage from '../../assets/logo-img.png';
import { env } from '../../config/env';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 23 23" width="23" height="23">
    <path fill="#f35022" d="M0 0h11v11H0z" />
    <path fill="#80bb03" d="M12 0h11v11H12z" />
    <path fill="#00a1f1" d="M0 12h11v11H0z" />
    <path fill="#ffbb00" d="M12 12h11v11H12z" />
  </svg>
);

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // 1. Fetch user info from Google
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        // 2. Save user info in Django backend (Supabase)
        const backendRes = await fetch(`${env.backendUrl}/api/auth/save-user/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
          body: JSON.stringify({
            token: tokenResponse.access_token,
            email: userInfo.email,
            name: userInfo.name,
            provider: 'google',
            avatar_url: userInfo.picture,
          }),
        });

        if (backendRes.ok) {
          // 3. Store locally and redirect
          localStorage.setItem('user', JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            avatar_url: userInfo.picture
          }));
          navigate('/dashboard');
        } else {
          alert('Failed to sync with backend. Please try again.');
        }
      } catch (error) {
        console.error('Login Process Error:', error);
        alert('An error occurred during login.');
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
      alert('Login Failed. Please try again.');
    },
  });

  const handleMicrosoftLogin = () => {
    alert('Microsoft Login integration coming soon!');
  };

  return (
    <div className="login-container">
      {/* Top Left Logo */}
      <motion.div 
        className="top-left-logo"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img src={logoImage} alt="Logo" className="nav-logo" />
        <span className="nav-brand">IntelliConnect</span>
      </motion.div>

      {/* Base Background Image */}
      <div 
        className="login-bg-image" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Login Card */}
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="card-header">
          <motion.img 
            src={logoImage} 
            alt="IntelliConnect Logo" 
            className="card-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
          <motion.h1 
            className="brand-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            IntelliConnect
          </motion.h1>
        </div>

        <div className="divider-container">
          <div className="divider-line"></div>
          <div className="divider-accent"></div>
        </div>

        <div className="button-group">
          <motion.button 
            className="social-button"
            whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => loginWithGoogle()}
          >
            <div className="shine-sweep"></div>
            <div className="icon-wrapper">
              <GoogleIcon />
            </div>
            <span>Continue with Google</span>
          </motion.button>

          <motion.button 
            className="social-button"
            whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={handleMicrosoftLogin}
          >
            <div className="shine-sweep"></div>
            <div className="icon-wrapper">
              <MicrosoftIcon />
            </div>
            <span>Continue with Microsoft</span>
          </motion.button>
        </div>

        <div className="card-footer">
          <div className="footer-divider"></div>
          <motion.div 
            className="trust-badges"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="badge-item">
              <ShieldCheck size={18} className="badge-icon" />
              <span>Secure</span>
            </div>
            <span className="badge-dot">•</span>
            <span>Reliable</span>
            <span className="badge-dot">•</span>
            <span>Trusted</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
