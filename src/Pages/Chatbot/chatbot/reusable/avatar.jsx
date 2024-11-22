import React from 'react';

const Avatar = ({ initials, color, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-16 h-16 text-xl'
  };

  const bgColor = color || 'bg-gray-300';

  return (
    <div className={`flex items-center justify-center rounded-full ${bgColor} ${sizeClasses[size]} text-white`}>
      {initials || '??'}
    </div>
  );
};

export default Avatar;