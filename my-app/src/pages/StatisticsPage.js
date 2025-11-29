import React, { useState, useEffect } from 'react';
import { statisticsAPI } from '../services/api';
import '../styles/StatisticsPage.css';

const StatisticsPage = ({ isArabic }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Translations
  const translations = {
    en: {
      title: 'Statistics Dashboard',
      overview: 'Overview',
      reservations: 'Reservations',
      users: 'Users',
      financial: 'Financial',
      trends: 'Trends',
      totalReservations: 'Total Reservations',
      activeReservations: 'Active Reservations',
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      byStatus: 'By Status',
      byType: 'By Type',
      byBranch: 'By Branch',
      byCurrency: 'By Currency',
      byDepartment: 'By Department',
      topPerformers: 'Top Performers',
      topDestinations: 'Top Destinations',
      recentReservations: 'Recent Reservations',
      monthlyTrends: 'Monthly Trends',
      fileNumber: 'File Number',
      client: 'Client',
      date: 'Date',
      amount: 'Amount',
      progress: 'Progress',
      status: 'Status',
      refresh: 'Refresh',
      loading: 'Loading statistics...',
      error: 'Failed to load statistics',
      noData: 'No data available',
      reservationsCount: 'Reservations',
      confirmed: 'Confirmed',
      unconfirmed: 'Unconfirmed',
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      individual: 'Individual',
      corporate: 'Corporate',
      government: 'Government',
      travelAgent: 'Travel Agent',
      tourOperator: 'Tour Operator',
      totalAmount: 'Total Amount',
      destination: 'Destination',
      count: 'Count'
    },
    ar: {
      title: 'لوحة الإحصائيات',
      overview: 'نظرة عامة',
      reservations: 'الحجوزات',
      users: 'المستخدمين',
      financial: 'المالية',
      trends: 'الاتجاهات',
      totalReservations: 'إجمالي الحجوزات',
      activeReservations: 'الحجوزات النشطة',
      totalUsers: 'إجمالي المستخدمين',
      activeUsers: 'المستخدمين النشطين',
      byStatus: 'حسب الحالة',
      byType: 'حسب النوع',
      byBranch: 'حسب الفرع',
      byCurrency: 'حسب العملة',
      byDepartment: 'حسب القسم',
      topPerformers: 'الأفضل أداءً',
      topDestinations: 'أفضل الوجهات',
      recentReservations: 'الحجوزات الأخيرة',
      monthlyTrends: 'الاتجاهات الشهرية',
      fileNumber: 'رقم الملف',
      client: 'العميل',
      date: 'التاريخ',
      amount: 'المبلغ',
      progress: 'التقدم',
      status: 'الحالة',
      refresh: 'تحديث',
      loading: 'جاري تحميل الإحصائيات...',
      error: 'فشل تحميل الإحصائيات',
      noData: 'لا توجد بيانات',
      reservationsCount: 'الحجوزات',
      confirmed: 'مؤكد',
      unconfirmed: 'غير مؤكد',
      pending: 'قيد الانتظار',
      inProgress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      individual: 'فردي',
      corporate: 'شركة',
      government: 'حكومي',
      travelAgent: 'وكيل سفر',
      tourOperator: 'منظم رحلات',
      totalAmount: 'المبلغ الإجمالي',
      destination: 'الوجهة',
      count: 'العدد'
    }
  };

  const t = isArabic ? translations.ar : translations.en;

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await statisticsAPI.getGeneral();
      if (response.status === 'success') {
        setStatistics(response.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US').format(num);
  };

  const getMonthName = (month) => {
    const months = isArabic 
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const translateStatus = (status) => {
    const statusMap = {
      'Pending': t.pending,
      'In Progress': t.inProgress,
      'Completed': t.completed,
      'Complete': t.completed,
      'Cancelled': t.cancelled,
      'Confirmed': t.confirmed,
      'UnConfirmed': t.unconfirmed
    };
    return statusMap[status] || status;
  };

  const translateType = (type) => {
    const typeMap = {
      'individual': t.individual,
      'corporate': t.corporate,
      'government': t.government,
      'travel_agent': t.travelAgent,
      'tour_operator': t.tourOperator
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="statistics-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchStatistics} className="retry-button">
            {t.refresh}
          </button>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="statistics-page">
        <div className="no-data-container">
          <p>{t.noData}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <h1 className="statistics-title">{t.title}</h1>
        <button onClick={fetchStatistics} className="refresh-button">
          <span className="btn-icon">🔄</span>
          {t.refresh}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="statistics-tabs">
        <button 
          className={`tab-button ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          📊 {t.overview}
        </button>
        <button 
          className={`tab-button ${selectedTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setSelectedTab('reservations')}
        >
          📅 {t.reservations}
        </button>
        <button 
          className={`tab-button ${selectedTab === 'users' ? 'active' : ''}`}
          onClick={() => setSelectedTab('users')}
        >
          👥 {t.users}
        </button>
        <button 
          className={`tab-button ${selectedTab === 'financial' ? 'active' : ''}`}
          onClick={() => setSelectedTab('financial')}
        >
          💰 {t.financial}
        </button>
        <button 
          className={`tab-button ${selectedTab === 'trends' ? 'active' : ''}`}
          onClick={() => setSelectedTab('trends')}
        >
          📈 {t.trends}
        </button>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="tab-content">
          {/* Summary Cards */}
          <div className="stats-cards-grid">
            <div className="stats-card blue-card">
              <div className="stats-card-icon">📅</div>
              <div className="stats-card-content">
                <h3>{t.totalReservations}</h3>
                <p className="stats-number">{formatNumber(statistics.overview.totalReservations)}</p>
              </div>
            </div>

            <div className="stats-card green-card">
              <div className="stats-card-icon">✅</div>
              <div className="stats-card-content">
                <h3>{t.activeReservations}</h3>
                <p className="stats-number">{formatNumber(statistics.overview.activeReservations)}</p>
              </div>
            </div>

            <div className="stats-card purple-card">
              <div className="stats-card-icon">👥</div>
              <div className="stats-card-content">
                <h3>{t.totalUsers}</h3>
                <p className="stats-number">{formatNumber(statistics.overview.totalUsers)}</p>
              </div>
            </div>

            <div className="stats-card orange-card">
              <div className="stats-card-icon">👤</div>
              <div className="stats-card-content">
                <h3>{t.activeUsers}</h3>
                <p className="stats-number">{formatNumber(statistics.overview.activeUsers)}</p>
              </div>
            </div>
          </div>

          {/* Recent Reservations */}
          <div className="stats-section">
            <h2 className="section-title">📋 {t.recentReservations}</h2>
            <div className="stats-table-container">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>{t.fileNumber}</th>
                    <th>{t.client}</th>
                    <th>{t.date}</th>
                    <th>{t.amount}</th>
                    <th>{t.progress}</th>
                    <th>{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.recent.map((reservation) => (
                    <tr key={reservation._id}>
                      <td>{reservation.fileNumber}</td>
                      <td>{reservation.client}</td>
                      <td>{formatDate(reservation.date)}</td>
                      <td>{reservation.amount || '-'}</td>
                      <td>
                        <span className={`status-badge status-${reservation.progress.toLowerCase().replace(' ', '-')}`}>
                          {translateStatus(reservation.progress)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${reservation.confirmStatus.toLowerCase()}`}>
                          {translateStatus(reservation.confirmStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reservations Tab */}
      {selectedTab === 'reservations' && (
        <div className="tab-content">
          <div className="stats-grid">
            {/* By Status */}
            <div className="stats-section">
              <h2 className="section-title">📊 {t.byStatus}</h2>
              <div className="chart-container">
                {statistics.reservations.byStatus.map((item) => (
                  <div key={item._id} className="chart-bar-item">
                    <div className="chart-label">{translateStatus(item._id)}</div>
                    <div className="chart-bar-wrapper">
                      <div 
                        className="chart-bar" 
                        style={{ 
                          width: `${(item.count / statistics.overview.totalReservations) * 100}%` 
                        }}
                      >
                        <span className="chart-value">{formatNumber(item.count)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Confirm Status */}
            <div className="stats-section">
              <h2 className="section-title">✓ {t.status}</h2>
              <div className="chart-container">
                {statistics.reservations.byConfirmStatus.map((item) => (
                  <div key={item._id} className="chart-bar-item">
                    <div className="chart-label">{translateStatus(item._id)}</div>
                    <div className="chart-bar-wrapper">
                      <div 
                        className="chart-bar confirm-bar" 
                        style={{ 
                          width: `${(item.count / statistics.overview.totalReservations) * 100}%` 
                        }}
                      >
                        <span className="chart-value">{formatNumber(item.count)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Type */}
            {statistics.reservations.byType.length > 0 && (
              <div className="stats-section">
                <h2 className="section-title">🏷️ {t.byType}</h2>
                <div className="chart-container">
                  {statistics.reservations.byType.map((item) => (
                    <div key={item._id} className="chart-bar-item">
                      <div className="chart-label">{translateType(item._id)}</div>
                      <div className="chart-bar-wrapper">
                        <div 
                          className="chart-bar type-bar" 
                          style={{ 
                            width: `${(item.count / statistics.overview.totalReservations) * 100}%` 
                          }}
                        >
                          <span className="chart-value">{formatNumber(item.count)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* By Currency */}
            <div className="stats-section">
              <h2 className="section-title">💱 {t.byCurrency}</h2>
              <div className="chart-container">
                {statistics.reservations.byCurrency.map((item) => (
                  <div key={item._id} className="chart-bar-item">
                    <div className="chart-label">{item._id}</div>
                    <div className="chart-bar-wrapper">
                      <div 
                        className="chart-bar currency-bar" 
                        style={{ 
                          width: `${(item.count / statistics.overview.totalReservations) * 100}%` 
                        }}
                      >
                        <span className="chart-value">{formatNumber(item.count)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Branch */}
            {statistics.reservations.byBranch.length > 0 && (
              <div className="stats-section">
                <h2 className="section-title">🏢 {t.byBranch}</h2>
                <div className="chart-container">
                  {statistics.reservations.byBranch.map((item) => (
                    <div key={item._id} className="chart-bar-item">
                      <div className="chart-label">{item._id}</div>
                      <div className="chart-bar-wrapper">
                        <div 
                          className="chart-bar branch-bar" 
                          style={{ 
                            width: `${(item.count / statistics.overview.totalReservations) * 100}%` 
                          }}
                        >
                          <span className="chart-value">{formatNumber(item.count)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Destinations */}
            {statistics.destinations.length > 0 && (
              <div className="stats-section">
                <h2 className="section-title">✈️ {t.topDestinations}</h2>
                <div className="chart-container">
                  {statistics.destinations.map((item) => (
                    <div key={item._id} className="chart-bar-item">
                      <div className="chart-label">{item._id}</div>
                      <div className="chart-bar-wrapper">
                        <div 
                          className="chart-bar destination-bar" 
                          style={{ 
                            width: `${(item.count / statistics.destinations[0].count) * 100}%` 
                          }}
                        >
                          <span className="chart-value">{formatNumber(item.count)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <div className="tab-content">
          <div className="stats-grid">
            {/* By Department */}
            {statistics.users.byDepartment.length > 0 && (
              <div className="stats-section">
                <h2 className="section-title">🏢 {t.byDepartment}</h2>
                <div className="chart-container">
                  {statistics.users.byDepartment.map((item) => (
                    <div key={item._id} className="chart-bar-item">
                      <div className="chart-label">{item._id}</div>
                      <div className="chart-bar-wrapper">
                        <div 
                          className="chart-bar department-bar" 
                          style={{ 
                            width: `${(item.count / statistics.overview.totalUsers) * 100}%` 
                          }}
                        >
                          <span className="chart-value">{formatNumber(item.count)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* By Branch */}
            {statistics.users.byBranch.length > 0 && (
              <div className="stats-section">
                <h2 className="section-title">🏢 {t.byBranch}</h2>
                <div className="chart-container">
                  {statistics.users.byBranch.map((item) => (
                    <div key={item._id} className="chart-bar-item">
                      <div className="chart-label">{item._id}</div>
                      <div className="chart-bar-wrapper">
                        <div 
                          className="chart-bar branch-bar" 
                          style={{ 
                            width: `${(item.count / statistics.overview.totalUsers) * 100}%` 
                          }}
                        >
                          <span className="chart-value">{formatNumber(item.count)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Performers */}
            {statistics.users.topPerformers.length > 0 && (
              <div className="stats-section full-width">
                <h2 className="section-title">🏆 {t.topPerformers}</h2>
                <div className="stats-table-container">
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t.users}</th>
                        <th>{t.byBranch}</th>
                        <th>{t.reservationsCount}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statistics.users.topPerformers.map((user, index) => (
                        <tr key={user._id}>
                          <td>{index + 1}</td>
                          <td>{user.fullName}</td>
                          <td>{user.branch || '-'}</td>
                          <td>
                            <span className="badge badge-primary">
                              {formatNumber(user.reservationCount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Financial Tab */}
      {selectedTab === 'financial' && (
        <div className="tab-content">
          <div className="stats-grid">
            <div className="stats-section">
              <h2 className="section-title">💰 {t.totalAmount} {t.byCurrency}</h2>
              <div className="financial-cards">
                {statistics.financial.totalsByCurrency.map((item) => (
                  <div key={item._id} className="financial-card">
                    <div className="financial-currency">{item._id}</div>
                    <div className="financial-amount">
                      {formatNumber(item.total.toFixed(2))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {selectedTab === 'trends' && (
        <div className="tab-content">
          <div className="stats-section full-width">
            <h2 className="section-title">📈 {t.monthlyTrends}</h2>
            <div className="trends-chart">
              {statistics.trends.monthly.map((item) => (
                <div key={`${item._id.year}-${item._id.month}`} className="trend-bar-item">
                  <div className="trend-bar-wrapper">
                    <div 
                      className="trend-bar" 
                      style={{ 
                        height: `${(item.count / Math.max(...statistics.trends.monthly.map(m => m.count))) * 200}px` 
                      }}
                    >
                      <span className="trend-value">{formatNumber(item.count)}</span>
                    </div>
                  </div>
                  <div className="trend-label">
                    {getMonthName(item._id.month)} {item._id.year}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;

