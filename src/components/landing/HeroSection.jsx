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
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', // Placeholder video URL
    },
    {
      type: 'image',
      src: banner_2, // Placeholder image
    },
    {
      type: 'video',
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', // Placeholder video URL
    },
    {
      type: 'image',
      src: banner, // Placeholder image
    },
  ];

  return (
    <section className="bg-tertiary relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden">
      <style>
        {`
          .slick-dots {
            z-index: 20;
            bottom: 20px;
          }
          .slick-dots li button:before {
            color: white;
            opacity: 0.7;
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
          .slick-prev:before,
          .slick-next:before {
            color: white;
            font-size: 20px;
          }
        `}
      </style>
      <div className="absolute inset-0 z-0">
        <Slider {...sliderSettings}>
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
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-fade-in-up">
          {t('home.hero')}
        </h1>
        <p className="text-xl text-text mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {t('home.heroDesc')}
        </p>
        <div className={`flex flex-col sm:flex-row gap-4 justify-center ${language === 'ar' ? 'sm:flex-row-reverse' : ''} animate-scale-in`} style={{ animationDelay: '0.4s' }}>
          <Button size="xl" as={Link} to="/login">
            {t('home.cta')}
          </Button>
          <Button variant="outline" size="xl" as={Link} to="#features">
            {t('home.learnMore')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
