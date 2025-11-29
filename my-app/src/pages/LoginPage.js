import React, { useState } from 'react';
import '../styles/LoginPage.css';

const LoginPage = ({ onLogin, isArabic, toggleLanguage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const translations = {
    en: {
      welcome: "Welcome Back",
      subtitle: "Egypt Holiday Makers",
      description: "Tourism Management System",
      username: "Username or Login Code",
      usernamePlaceholder: "Enter username or login code",
      password: "Password",
      login: "Login",
      forgotPassword: "Forgot Password?",
      rememberMe: "Remember me",
      noAccount: "Don't have an account?",
      contactAdmin: "Contact Administrator",
      invalidCredentials: "Invalid username/code or password",
      fillAllFields: "Please fill in all fields"
    },
    ar: {
      welcome: "مرحباً بعودتك",
      subtitle: "Egypt Holiday Makers",
      description: "نظام إدارة السياحة",
      username: "اسم المستخدم أو كود تسجيل الدخول",
      usernamePlaceholder: "أدخل اسم المستخدم أو كود تسجيل الدخول",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      forgotPassword: "نسيت كلمة المرور؟",
      rememberMe: "تذكرني",
      noAccount: "ليس لديك حساب؟",
      contactAdmin: "اتصل بالمسؤول",
      invalidCredentials: "اسم المستخدم/الكود أو كلمة المرور غير صحيحة",
      fillAllFields: "يرجى ملء جميع الحقول"
    }
  };

  const t = isArabic ? translations.ar : translations.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(t.fillAllFields);
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Login successful - pass user data and token to parent
        const loginData = {
          user: data.data.user,
          token: data.data.token
        };
        
        // Store token in localStorage
        localStorage.setItem('ehm_token', data.data.token);
        localStorage.setItem('ehm_user', JSON.stringify(data.data.user));
        
        // Call parent login handler
        const success = onLogin(loginData);
        
        // If login handler doesn't redirect, reset loading after a short delay
        if (success !== false) {
          setTimeout(() => setIsLoading(false), 1000);
        } else {
          setError(t.invalidCredentials);
          setIsLoading(false);
        }
      } else {
        // Login failed
        setError(data.message || t.invalidCredentials);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'AbortError') {
        setError(isArabic ? 'انتهت مهلة الاتصال' : 'Connection timeout. Please try again.');
      } else {
        setError(isArabic ? 'خطأ في الاتصال بالخادم' : 'Connection error: ' + error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-container ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Background Decorations */}
      <div className="login-bg-decoration decoration-1"></div>
      <div className="login-bg-decoration decoration-2"></div>
      <div className="login-bg-decoration decoration-3"></div>

      {/* Language Toggle */}
      <button 
        className="login-language-toggle"
        onClick={toggleLanguage}
        title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
      >
        🌐 {isArabic ? 'EN' : 'عربي'}
      </button>

      {/* Login Card */}
      <div className="login-card">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="login-logo">
            <div className="logo-icon">🏖️</div>
            <h1 className="logo-text">Egypt Holiday Makers</h1>
          </div>
          <p className="login-tagline">{t.description}</p>
          <div className="branding-illustration">
            <div className="illustration-circle circle-1"></div>
            <div className="illustration-circle circle-2"></div>
            <div className="illustration-circle circle-3"></div>
            <div className="illustration-icon">✈️</div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="login-header">
            <h2 className="login-title">{t.welcome}</h2>
            <p className="login-subtitle">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Username or Code Field */}
            <div className="form-group">
              <label className="form-label">{t.username}</label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t.usernamePlaceholder}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">{t.password}</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder={t.password}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Remember Me */}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>{t.rememberMe}</span>
              </label>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>{t.login}...</span>
                </>
              ) : (
                <>
                  <span>{t.login}</span>
                  <span className="button-icon">→</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="demo-info">
            <p>🔑 {isArabic ? 'تجريبي: admin / admin123' : 'Demo: admin / admin123'}</p>
            <p style={{fontSize: '12px', marginTop: '5px', opacity: 0.8}}>
              {isArabic ? 'أو: manager / manager123' : 'Or: manager / manager123'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="login-footer">
        <p>© 2025 Egypt Holiday Makers. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;

