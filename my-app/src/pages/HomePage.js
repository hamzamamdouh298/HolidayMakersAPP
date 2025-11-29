import React from 'react';

const HomePage = ({ t, companyName, onNavigate }) => {
  return (
    <>
      <div className="welcome-section">
        <h2 className="welcome-title">{t.welcome}</h2>
        <p className="welcome-subtitle">{t.subtitle}</p>
      </div>
      
      {/* Shortcuts Grid */}
      <div className="shortcuts-container">
        <div className="shortcut-card blue-card" onClick={() => onNavigate && onNavigate('reservations')}>
          <div className="shortcut-icon">📅</div>
          <div className="shortcut-text">{t.reservations}</div>
        </div>
        <div className="shortcut-card orange-card">
          <div className="shortcut-icon">📋</div>
          <div className="shortcut-text">{t.booking}</div>
        </div>
        <div className="shortcut-card cyan-card">
          <div className="shortcut-icon">🕌</div>
          <div className="shortcut-text">{t.religious}</div>
        </div>
        <div className="shortcut-card green-card">
          <div className="shortcut-icon">💰</div>
          <div className="shortcut-text">{t.accounting}</div>
        </div>
        <div className="shortcut-card pink-card">
          <div className="shortcut-icon">🚗</div>
          <div className="shortcut-text">{t.transportation}</div>
        </div>
        <div className="shortcut-card gray-card">
          <div className="shortcut-icon">👥</div>
          <div className="shortcut-text">{t.hrm}</div>
        </div>
      </div>

      {/* Reservation Report Section */}
      <div className="report-section-home">
        <div className="report-header">
          <div className="report-icon">📊</div>
          <h2 className="report-title">{t.reservationReport}</h2>
        </div>
        
        <div className="report-shortcuts-grid">
          <div className="report-shortcut-item">
            <div className="report-shortcut-icon blue-bg">✈️</div>
            <span className="report-shortcut-text">{t.flightReport}</span>
            <span className="report-arrow">→</span>
          </div>
          <div className="report-shortcut-item">
            <div className="report-shortcut-icon cyan-bg">📄</div>
            <span className="report-shortcut-text">{t.visa}</span>
            <span className="report-arrow">→</span>
          </div>
          <div className="report-shortcut-item">
            <div className="report-shortcut-icon green-bg">🕌</div>
            <span className="report-shortcut-text">{t.hajjUmrah}</span>
            <span className="report-arrow">→</span>
          </div>
          <div className="report-shortcut-item">
            <div className="report-shortcut-icon purple-bg">🏨</div>
            <span className="report-shortcut-text">{t.hotels}</span>
            <span className="report-arrow">→</span>
          </div>
          <div className="report-shortcut-item">
            <div className="report-shortcut-icon gray-bg">📋</div>
            <span className="report-shortcut-text">{t.otherReport}</span>
            <span className="report-arrow">→</span>
          </div>
          <div className="report-shortcut-item">
            <div className="report-shortcut-icon orange-bg">🛡️</div>
            <span className="report-shortcut-text">{t.insurance}</span>
            <span className="report-arrow">→</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

