import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../ui/Button';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import banner from '../../assets/banner.png';
import banner_2 from '../../assets/banner2.png';


const HeroSection = () => {
  const { t, language } = useLanguage();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const slides = [
    {
      type: 'video',
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    },
    {
      type: 'image',
      src: banner_2,
    },
    {
      type: 'video',
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    },
    {
      type: 'image',
      src: banner,
    },
  ];

  return (
    <section className="bg-tertiary relative py-0 min-h-[70vh] sm:min-h-[85vh] md:min-h-screen overflow-hidden">
      <style>
        {`
          .slick-slider,
          .slick-list,
          .slick-track,
          .slick-slide > div {
            height: 100%;
          }
          .slick-slide {
            height: 70vh;
          }
          @media (min-width: 640px) {
            .slick-slide {
              height: 85vh;
            }
          }
          @media (min-width: 768px) {
            .slick-slide {
              height: 100vh;
            }
          }
          .slick-dots {
            z-index: 20;
            bottom: 20px;
          }
          .slick-dots li {
            margin: 0 3px;
          }
          .slick-dots li button:before {
            color: white;
            opacity: 0.7;
            font-size: 10px;
          }
          .slick-dots li.slick-active button:before {
            opacity: 1;
            color: white;
          }
          .slick-arrow {
            z-index: 20;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            width: 40px;
            height: 40px;
          }
          .slick-prev {
            left: 25px;
          }
          .slick-next {
            right: 25px;
          }
          .slick-prev:before,
          .slick-next:before {
            color: white;
            font-size: 20px;
          }
        `}
      </style>
      {/* Desktop Carousel - Hidden on mobile */}
      <div className="hidden md:block absolute inset-0 z-0 h-full">
        <Slider {...sliderSettings} className="h-full">
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full relative">
              {slide.type === 'video' ? (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={slide.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={slide.src}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
          ))}
        </Slider>
      </div>
      
      {/* Mobile Static Background */}
      <div className="md:hidden absolute inset-0 z-0">
        <img
          src={banner}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col justify-center min-h-[60vh] sm:min-h-[75vh] md:min-h-[85vh] px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-light-text mb-4 sm:mb-6 animate-fade-in-up px-2">
          {t('home.hero')}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-light-text mb-6 sm:mb-8 max-w-full sm:max-w-2xl md:max-w-3xl mx-auto animate-fade-in-up px-4" style={{ animationDelay: '0.5s' }}>
          {t('home.heroDesc')}
        </p>
        <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center ${language === 'ar' ? 'sm:flex-row-reverse' : ''} animate-scale-in px-4`} style={{ animationDelay: '0.4s' }}>
          <Button size="lg" as={Link} to="/login" className="w-full sm:w-auto max-w-xs sm:max-w-none text-sm sm:text-base py-2 sm:py-3">
            {t('home.cta')}
          </Button>
          <Button variant="outline" size="lg" as={Link} to="#features" className="w-full sm:w-auto max-w-xs sm:max-w-none text-sm sm:text-base py-2 sm:py-3">
            {t('home.learnMore')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;