import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon,
  helperText,
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block mb-2 font-semibold text-gray-700 text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
            {icon}
          </span>
        )}
        <input 
          className={`
            w-full px-4 py-3 border-2 rounded-lg text-base transition-all
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10'}
            disabled:bg-gray-100 disabled:cursor-not-allowed
            outline-none
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && <span className="block mt-2 text-sm text-red-500">{error}</span>}
      {helperText && !error && <span className="block mt-2 text-sm text-gray-500">{helperText}</span>}
    </div>
  );
};

export default Input;
