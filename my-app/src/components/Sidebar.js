import React from 'react';

const Sidebar = ({ 
  sidebarOpen, 
  isArabic, 
  companyName,
  t,
  currentPage,
  setCurrentPage,
  reservationsOpen,
  toggleReservations,
  customersOpen,
  toggleCustomers,
  suppliersOpen,
  toggleSuppliers,
  managementsOpen,
  toggleManagements
}) => {
  return (
    <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">{companyName}</h1>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-item active" onClick={() => setCurrentPage('home')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">{t.home}</span>
        </div>

        <div className="nav-item-container">
          <div className="nav-item" onClick={toggleReservations}>
            <span className="nav-icon">📅</span>
            <span className="nav-text">{t.reservations}</span>
            <span className={`nav-arrow ${reservationsOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
          </div>
          <div className={`submenu ${reservationsOpen ? 'submenu-open' : 'submenu-closed'}`}>
            <div className="submenu-item" onClick={() => setCurrentPage('reservationReport')}>
              <span className="submenu-icon">📊</span>
              <span className="submenu-text">{t.reservationReport}</span>
            </div>
            <div className="submenu-item">
              <span className="submenu-icon">📋</span>
              <span className="submenu-text">{t.booking}</span>
            </div>
            <div className="submenu-item">
              <span className="submenu-icon">✈️</span>
              <span className="submenu-text">{t.flightReport}</span>
            </div>
            <div className="submenu-item" onClick={() => setCurrentPage('addAirportTransfer')}>
              <span className="submenu-icon">🚗</span>
              <span className="submenu-text">Add Airport Transfer</span>
            </div>
          </div>
        </div>

        <div className="nav-item-container">
          <div className="nav-item" onClick={toggleCustomers}>
            <span className="nav-icon">👥</span>
            <span className="nav-text">{t.customers}</span>
            <span className={`nav-arrow ${customersOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
          </div>
          <div className={`submenu ${customersOpen ? 'submenu-open' : 'submenu-closed'}`}>
            <div className="submenu-item">
              <span className="submenu-icon">➕</span>
              <span className="submenu-text">{t.add}</span>
            </div>
            <div className="submenu-item">
              <span className="submenu-icon">📋</span>
              <span className="submenu-text">{t.customers}</span>
            </div>
          </div>
        </div>

        <div className="nav-item-container">
          <div className="nav-item" onClick={toggleSuppliers}>
            <span className="nav-icon">🏢</span>
            <span className="nav-text">{t.suppliers}</span>
            <span className={`nav-arrow ${suppliersOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
          </div>
          <div className={`submenu ${suppliersOpen ? 'submenu-open' : 'submenu-closed'}`}>
            <div className="submenu-item">
              <span className="submenu-icon">➕</span>
              <span className="submenu-text">{t.add}</span>
            </div>
            <div className="submenu-item">
              <span className="submenu-icon">📋</span>
              <span className="submenu-text">{t.suppliers}</span>
            </div>
          </div>
        </div>

        <div className="nav-item-container">
          <div className="nav-item" onClick={toggleManagements}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">{t.managements}</span>
            <span className={`nav-arrow ${managementsOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
          </div>
          <div className={`submenu ${managementsOpen ? 'submenu-open' : 'submenu-closed'}`}>
            <div className="submenu-item" onClick={() => setCurrentPage('users')}>
              <span className="submenu-icon">👨‍💼</span>
              <span className="submenu-text">{t.users}</span>
            </div>
            <div className="submenu-item" onClick={() => setCurrentPage('roles')}>
              <span className="submenu-icon">🔐</span>
              <span className="submenu-text">{t.roles}</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

