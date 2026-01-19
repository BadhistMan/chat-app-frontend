import React from 'react';

const Loader = ({ size = 'md', message = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const loader = (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        {/* Spinning ring */}
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      {message && (
        <p className="mt-3 text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50 flex items-center justify-center">
        {loader}
      </div>
    );
  }

  return loader;
};

// Skeleton loader for content
export const SkeletonLoader = ({ type = 'message', count = 1 }) => {
  const skeletons = Array.from({ length: count });

  if (type === 'message') {
    return (
      <div className="space-y-4">
        {skeletons.map((_, idx) => (
          <div key={idx} className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full skeleton"></div>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded skeleton"></div>
                <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded skeleton"></div>
                <div className="w-2/3 h-4 bg-gray-300 dark:bg-gray-700 rounded skeleton"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chat-list') {
    return (
      <div className="space-y-4">
        {skeletons.map((_, idx) => (
          <div key={idx} className="flex items-center space-x-3 p-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full skeleton"></div>
            </div>
            <div className="flex-1">
              <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded skeleton mb-2"></div>
              <div className="w-48 h-3 bg-gray-300 dark:bg-gray-700 rounded skeleton"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full skeleton mb-4"></div>
          <div className="w-48 h-6 bg-gray-300 dark:bg-gray-700 rounded skeleton mb-2"></div>
          <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded skeleton"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full h-12 bg-gray-300 dark:bg-gray-700 rounded-lg skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Loader;
