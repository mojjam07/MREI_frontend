// import React from 'react';
// import { Users, BookOpen, Award } from 'lucide-react';
// import { useLanguage } from '../../context/LanguageContext';

// const FeaturesSection = () => {
//   const { t } = useLanguage();

//   const features = [
//     {
//       icon: Users,
//       title: t('home.expertTutors'),
//       description: t('home.expertDesc'),
//       color: 'blue'
//     },
//     {
//       icon: BookOpen,
//       title: t('home.flexibleSchedule'),
//       description: t('home.flexibleDesc'),
//       color: 'green'
//     },
//     {
//       icon: Award,
//       title: t('home.proven'),
//       description: t('home.provenDesc'),
//       color: 'purple'
//     }
//   ];

//   return (
//     <section id="features" className="py-20 bg-light-text">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl font-bold text-primary mb-4 animate-fade-in-up">
//             {t('home.whyChoose')}
//           </h2>
//         </div>
//         <div className="grid md:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <div key={index} className="text-center p-6 rounded-lg border border-accent hover:shadow-lg transition-shadow hover-lift animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
//               <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center hover-scale">
//                 <feature.icon className="w-8 h-8 text-primary" />
//               </div>
//               <h3 className="text-xl font-semibold text-primary mb-2">
//                 {feature.title}
//               </h3>
//               <p className="text-text">
//                 {feature.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturesSection;

import React from 'react';
import { Users, BookOpen, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: t('home.expertTutors'),
      description: t('home.expertDesc'),
      color: 'blue'
    },
    {
      icon: BookOpen,
      title: t('home.flexibleSchedule'),
      description: t('home.flexibleDesc'),
      color: 'green'
    },
    {
      icon: Award,
      title: t('home.proven'),
      description: t('home.provenDesc'),
      color: 'purple'
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 bg-light-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 animate-fade-in-up px-4">
            {t('home.whyChoose')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-4 sm:p-6 rounded-lg border border-accent hover:shadow-lg transition-shadow hover-lift animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-accent flex items-center justify-center hover-scale">
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-text">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;