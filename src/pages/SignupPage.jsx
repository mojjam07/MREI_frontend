import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import logo from '../assets/logo.png';
import bgImage from '../assets/banner.png';


const SignupPage = () => {
  const { signup } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSignup = async () => {
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.signup.error.passwordMismatch'));
      setLoading(false);
      return;
    }


    // Validate password length
    if (formData.password.length < 6) {
      setError(t('auth.signup.error.passwordTooShort'));
      setLoading(false);
      return;
    }

    // Validate password strength
    if (!/(?=.*[a-z])/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      setLoading(false);
      return;
    }

    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      setLoading(false);
      return;
    }

    if (!/(?=.*\d)/.test(formData.password)) {
      setError('Password must contain at least one number');
      setLoading(false);
      return;
    }


    // Validate required fields
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.password || !formData.username) {
      setError(t('auth.signup.error.requiredFields'));
      setLoading(false);
      return;
    }

    // Validate username
    if (formData.username.length < 3 || formData.username.length > 30) {
      setError('Username must be between 3 and 30 characters');
      setLoading(false);
      return;
    }

    // Validate username format (alphanumeric + underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      setLoading(false);
      return;
    }


    const result = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      role
    });

    setLoading(false);

    if (result.success) {
      // Show success message
      alert(t('auth.signup.success.accountCreated'));
      navigate('/login');
    } else {

      // Use translation for error messages if they match our predefined errors
      const errorKey = result.error?.toLowerCase().includes('email') && result.error?.toLowerCase().includes('exists') ? 
        'auth.signup.error.emailExists' :
        result.error?.toLowerCase().includes('network') ?
        'auth.signup.error.networkError' :
        result.error?.toLowerCase().includes('server') ?
        'auth.signup.error.serverError' :
        'auth.signup.error.unknown';
      setError(t(errorKey));
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
          className="bg-link hover:bg-primary bg-opacity-20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2"
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
          className="bg-link hover:bg-primary bg-opacity-20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2"
          title={language === 'en' ? 'عربي' : 'English'}
        >
          <span className="text-sm font-bold">EN|AR</span>
        </button>
      </div>


      <LoadingOverlay 
        isLoading={loading}
        loadingText={t('auth.signup.creatingAccount')}
        overlayColor="rgba(0, 0, 0, 0.8)"
        spinnerColor="var(--primary-color)"
        textColor="white"
      >
        <Card className="w-full max-w-md bg-white bg-opacity-90 shadow-lg">

        <div className="text-center mb-8">
          <img src={logo} alt="EduPlatform Logo" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">{t('auth.signup.title')}</h2>
          <p className="text-gray-600">{t('auth.signup.subtitle')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}


        <div className="space-y-4">
          <Input
            label={t('auth.signup.firstName')}
            name="firstName"
            type="text"
            placeholder={t('auth.signup.firstNamePlaceholder')}
            value={formData.firstName}
            onChange={handleChange}
          />
          <Input
            label={t('auth.signup.lastName')}
            name="lastName"
            type="text"
            placeholder={t('auth.signup.lastNamePlaceholder')}
            value={formData.lastName}
            onChange={handleChange}
          />
          <Input
            label="Username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
          <Input
            label={t('auth.signup.email')}
            name="email"
            type="email"
            placeholder={t('auth.signup.emailPlaceholder')}
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label={t('auth.signup.password')}
            name="password"
            type="password"
            placeholder={t('auth.signup.passwordPlaceholder')}
            value={formData.password}
            onChange={handleChange}
            showPasswordToggle
          />

          <Input
            label={t('auth.signup.confirmPassword')}
            name="confirmPassword"
            type="password"
            placeholder={t('auth.signup.confirmPasswordPlaceholder')}
            value={formData.confirmPassword}
            onChange={handleChange}
            showPasswordToggle
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('auth.signup.role')}</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">{t('auth.signup.roles.student')}</option>
              <option value="tutor">{t('auth.signup.roles.tutor')}</option>
              <option value="admin">{t('auth.signup.roles.admin')}</option>
              <option value="alumni">{t('auth.signup.roles.alumni')}</option>
            </select>
          </div>

          <Button onClick={handleSignup} className="w-full disabled">{t('auth.signup.createAccount')}</Button>

          <p className="text-center text-sm text-gray-600">
            {t('auth.signup.hasAccount')} <a href="#" onClick={() => navigate('/login')} className="text-blue-600 hover:underline">{t('auth.signup.signIn')}</a>
          </p>

        </div>
      </Card>
      </LoadingOverlay>
    </div>
  );
};

export default SignupPage;

