import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
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
    lastName: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async () => {
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.signup.error.passwordMismatch'));
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError(t('auth.signup.error.passwordTooShort'));
      return;
    }

    // Validate required fields
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
      setError(t('auth.signup.error.requiredFields'));
      return;
    }

    const result = await signup({
      email: formData.email,
      password: formData.password,
      password_confirm: formData.confirmPassword,
      first_name: formData.firstName,
      last_name: formData.lastName,
      role
    });

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
          />

          <Input
            label={t('auth.signup.confirmPassword')}
            name="confirmPassword"
            type="password"
            placeholder={t('auth.signup.confirmPasswordPlaceholder')}
            value={formData.confirmPassword}
            onChange={handleChange}
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

          <Button onClick={handleSignup} className="w-full">{t('auth.signup.createAccount')}</Button>

          <p className="text-center text-sm text-gray-600">
            {t('auth.signup.hasAccount')} <a href="#" onClick={() => navigate('/login')} className="text-blue-600 hover:underline">{t('auth.signup.signIn')}</a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
