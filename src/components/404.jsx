import React from 'react';

const NotFound = ({ setView }) => {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
      <p className="mt-2 text-gray-500">
        The page you are looking for does not exist.
      </p>
      <button 
        onClick={() => setView('home')} 
        className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;