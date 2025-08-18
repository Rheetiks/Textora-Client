import React from 'react';
import './Loader.css';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loader;