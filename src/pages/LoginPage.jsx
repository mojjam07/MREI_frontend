import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import logo from '../assets/logo.png';
import bgImage from '../assets/banner.png';

const LoginPage = () => {
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      // Use translation for error messages if they match our predefined errors
      const errorKey = result.error?.toLowerCase().includes('invalid') ? 
        'auth.login.error.invalidCredentials' :
        result.error?.toLowerCase().includes('network') ?
        'auth.login.error.networkError' :
        result.error?.toLowerCase().includes('server') ?
        'auth.login.error.serverError' :
        'auth.login.error.unknown';
      setError(t(errorKey));
      return;
    }

    const role = result.user?.role;

    // Navigate based on user role
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'tutor') {
      navigate('/tutor/dashboard');
    } else if (role === 'alumni') {
      navigate('/alumni/dashboard');
    } else {
      // Default to student dashboard
      navigate('/student/dashboard');
    }
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
        >
          <span className="text-sm font-medium">
            {t('nav.home')}
          </span>
        </button>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2"
        >
          <span className="text-sm font-medium">
            {language === 'en' ? 'عربي' : 'English'}
          </span>
        </button>
      </div>

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
    </div>
  );
};

export default LoginPage;
