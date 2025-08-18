import React from 'react';
import './NotFoundPage.css';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = ({ type = 'Page' }) => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">{type} Not Found</h2>
        <p className="not-found-text">
          The {type.toLowerCase()} you are looking for doesn't exist or may have been moved. Please check the URL and try again.
        </p>
        <button className="not-found-button" onClick={goHome}>
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
