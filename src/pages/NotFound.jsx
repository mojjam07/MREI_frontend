import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/ui/Button';
import UniversityHeader from '../components/landing/UniversityHeader';
import Footer from '../components/layout/Footer';

const NotFound = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-light-text">
      {/* University Header */}
      <UniversityHeader />

      {/* 404 Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <div className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-primary opacity-20 leading-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Search className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-light-text" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
              {isRTL ? 'الصفحة غير موجودة' : 'Page Not Found'}
            </h1>
            <p className="text-lg sm:text-xl text-text max-w-lg mx-auto leading-relaxed">
              {isRTL 
                ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر.'
                : 'Sorry, the page you\'re looking for doesn\'t exist or has been moved to another location.'
              }
            </p>
            <p className="text-base sm:text-lg text-text/80 max-w-2xl mx-auto">
              {isRTL 
                ? 'تأكد من الرابط أو عد إلى الصفحة الرئيسية للمتابعة.'
                : 'Double-check the URL or return to our homepage to continue your journey.'
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button 
              as={Link} 
              to="/" 
              size="lg" 
              className="w-full sm:w-auto min-w-[180px] flex items-center gap-2 justify-center"
            >
              <Home className="w-5 h-5" />
              {isRTL ? 'الصفحة الرئيسية' : 'Go Home'}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto min-w-[180px] flex items-center gap-2 justify-center"
            >
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              {isRTL ? 'العودة للخلف' : 'Go Back'}
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-accent">
            <h2 className="text-lg font-semibold text-text mb-4">
              {isRTL ? 'روابط مفيدة:' : 'Helpful Links:'}
            </h2>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link 
                to="/" 
                className="text-link hover:text-link-hover transition-colors hover:underline"
              >
                {isRTL ? 'الصفحة الرئيسية' : 'Home'}
              </Link>
              <Link 
                to="/login" 
                className="text-link hover:text-link-hover transition-colors hover:underline"
              >
                {isRTL ? 'تسجيل الدخول' : 'Login'}
              </Link>
              <Link 
                to="/signup" 
                className="text-link hover:text-link-hover transition-colors hover:underline"
              >
                {isRTL ? 'إنشاء حساب' : 'Sign Up'}
              </Link>
              <a 
                href="#contact" 
                className="text-link hover:text-link-hover transition-colors hover:underline"
              >
                {isRTL ? 'اتصل بنا' : 'Contact Us'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NotFound;
