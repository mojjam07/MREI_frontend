
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import logo from '../assets/logo.png';
import bgImage from '../assets/banner.png';

const LoginPage = () => {
  const { login, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function to get dashboard path based on user role
  const getDashboardPath = (userRole) => {
    const role = userRole?.toLowerCase();
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'tutor':
        return '/tutor/dashboard';
      case 'alumni':
        return '/alumni/dashboard';
      case 'student':
      default:
        return '/student/dashboard';
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && user.role) {
      const dashboardPath = getDashboardPath(user.role);
      console.log('User already authenticated, redirecting to:', dashboardPath);
      navigate(dashboardPath, { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      // Safely handle error message
      const errorMsg = result.error || 'Login failed';
      
      // Use translation for error messages if they match our predefined errors
      let errorKey = 'auth.login.error.unknown';
      if (errorMsg.toLowerCase().includes('invalid')) {
        errorKey = 'auth.login.error.invalidCredentials';
      } else if (errorMsg.toLowerCase().includes('network')) {
        errorKey = 'auth.login.error.networkError';
      } else if (errorMsg.toLowerCase().includes('server')) {
        errorKey = 'auth.login.error.serverError';
      }
      setError(t(errorKey));
      return;
    }

    // Get role from login result - prioritize result.role, then result.user?.role
    // Don't rely on user?.role from context as it might not be updated yet
    const role = result.role || result.user?.role;
    
    if (!role) {
      console.error('Login response missing role:', result);
      setError('Login successful but role not found. Please contact support.');
      return;
    }
    
    console.log('Login successful, role:', role, 'result:', result);
    
    const dashboardPath = getDashboardPath(role);
    console.log('Redirecting to:', dashboardPath);
    
    // Use replace: true to prevent going back to login page
    navigate(dashboardPath, { replace: true });
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Home Link */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate('/')}
          className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2"
          title={t('nav.home')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2"
          title={language === 'en' ? 'عربي' : 'English'}
        >
          <span className="text-sm font-bold">EN|AR</span>
        </button>
      </div>


      <LoadingOverlay 
        isLoading={loading}
        loadingText={t('auth.login.signingIn')}
        overlayColor="rgba(0, 0, 0, 0.8)"
        spinnerColor="var(--primary-color)"
        textColor="white"
      >
        <Card className="w-full max-w-md bg-white bg-opacity-90 shadow-lg">

        <div className="text-center mb-8">
          <img src={logo} alt="EduPlatform Logo" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">{t('auth.login.title')}</h2>
          <p className="text-gray-600">{t('auth.login.subtitle')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label={t('auth.login.email')}
            type="email"
            placeholder={t('auth.login.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label={t('auth.login.password')}
            type="password"
            placeholder={t('auth.login.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle
            required
          />

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('auth.login.signingIn') : t('auth.login.signIn')}
          </Button>

          <p className="text-center text-sm text-gray-600">
            {t('auth.login.noAccount')} <span onClick={() => navigate('/signup')} className="text-blue-600 hover:underline cursor-pointer">{t('auth.login.signUp')}</span>
          </p>

        </form>
      </Card>
      </LoadingOverlay>
    </div>
  );
};

export default LoginPage;
