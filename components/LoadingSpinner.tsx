import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-32 w-full animate-fade-in">
      <div className="relative">
        {/* Background ring */}
        <div className="w-12 h-12 rounded-full border-2 border-gray-100"></div>
        {/* Spinning ring */}
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-gold-500 border-t-transparent animate-spin"></div>
      </div>
      <span className="mt-4 text-base font-serif font-bold text-gray-900 uppercase tracking-wider">Trevi Rent car</span>
    </div>
  );
};

export default LoadingSpinner;