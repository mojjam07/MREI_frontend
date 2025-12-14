import React from 'react';

const LoadingOverlay = ({ 
  isLoading, 
  children, 
  loadingText = "Loading...", 
  overlayColor = "rgba(0, 0, 0, 0.75)",
  spinnerColor = "var(--primary-color, #3B82F6)",
  textColor = "white",
  showBackground = true 
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Dark overlay mask */}
      <div 
        className="absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
        style={{
          backgroundColor: overlayColor,
          backdropFilter: 'blur(2px)'
        }}
      >
        {/* Loading content container */}
        <div className="text-center">
          {/* Spinner */}
          <div 
            className="animate-spin rounded-full border-4 border-t-transparent mx-auto mb-4"
            style={{
              width: '3rem',
              height: '3rem',
              borderColor: spinnerColor,
              borderTopColor: 'transparent'
            }}
          ></div>
          
          {/* Loading text */}
          <p 
            className="text-lg font-medium animate-pulse"
            style={{ color: textColor }}
          >
            {loadingText}
          </p>
          
          {/* Optional loading dots animation */}
          <div className="flex justify-center mt-3 space-x-1">
            <div 
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ 
                backgroundColor: textColor,
                animationDelay: '0ms'
              }}
            ></div>
            <div 
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ 
                backgroundColor: textColor,
                animationDelay: '150ms'
              }}
            ></div>
            <div 
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ 
                backgroundColor: textColor,
                animationDelay: '300ms'
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Content underneath (dimmed) */}
      <div className={showBackground ? 'opacity-50 pointer-events-none' : 'pointer-events-none'}>
        {children}
      </div>
    </div>
  );
};

export default LoadingOverlay;
