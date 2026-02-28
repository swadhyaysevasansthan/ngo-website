import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      className={`
        bg-white rounded-xl shadow-md p-6 transition-all duration-300
        ${hover ? 'hover:-translate-y-1 hover:shadow-xl' : ''}
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
