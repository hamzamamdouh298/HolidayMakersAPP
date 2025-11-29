import React from 'react';

const TopBanner = ({ 
  toggleSidebar, 
  sidebarOpen, 
  toggleLanguage, 
  isArabic, 
  getCurrentDate,
  userMenuOpen,
  toggleUserMenu,
  t 
}) => {
  return (
    <div className="top-banner">
      <div className="banner-content">
        <div className="banner-left">
          <button 
            className={`menu-icon ${sidebarOpen ? 'menu-open' : 'menu-closed'}`} 
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <button className="more-icon">⋮</button>
        </div>
        <div className="banner-center">
          <button className="notification-icon">🔔</button>
        </div>
        <div className="banner-right">
          <button className="shop-icon">🏪</button>
          <button 
            className={`globe-icon ${isArabic ? 'active' : ''}`} 
            onClick={toggleLanguage}
            title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
          >
            🌐
          </button>
        </div>
      </div>
      <div className="banner-date">
        <span>{getCurrentDate()}</span>
        <div className="user-menu-container">
          <div className="user-info" onClick={toggleUserMenu}>
            <span className="user-name-banner">Eiolv</span>
            <div className="user-avatar-banner">👤</div>
          </div>
          {userMenuOpen && (
            <div className="user-dropdown-menu">
              <div className="user-dropdown-header">
                <div className="user-avatar-large">👤</div>
                <div className="user-details">
                  <div className="user-name-large">Eiolv</div>
                  <div className="user-role">{t.admin}</div>
                </div>
              </div>
              <div className="user-dropdown-items">
                <div className="user-dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  <span className="dropdown-text">{t.profile}</span>
                </div>
                <div className="user-dropdown-item">
                  <span className="dropdown-icon">⚙️</span>
                  <span className="dropdown-text">{t.settings}</span>
                </div>
                <div className="user-dropdown-item">
                  <span className="dropdown-icon">📋</span>
                  <span className="dropdown-text">{t.updates}</span>
                </div>
                <div className="user-dropdown-item history-item">
                  <span className="dropdown-icon">🕐</span>
                  <span className="dropdown-text">{t.history}</span>
                </div>
                <div className="user-dropdown-item logout-item">
                  <span className="dropdown-icon">🚪</span>
                  <span className="dropdown-text">{t.logout}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBanner;

