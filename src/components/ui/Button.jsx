import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', as: Component = 'button', ...props }) => {
  const variants = {
    primary: 'bg-primary hover:bg-secondary text-light-text',
    secondary: 'bg-accent hover:bg-accent text-text',
    outline: 'border-2 border-primary text-primary hover:bg-tertiary hover:bg-accent',
    onblue: 'border-2 border-tertiary text-tertiary hover:bg-link-hover' 
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
    '2xl': 'px-10 py-5 text-2xl',
  };

  return (
    <Component
      className={`rounded-lg font-medium transition-colors ${sizeClasses[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
