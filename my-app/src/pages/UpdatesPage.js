import React, { useState } from 'react';

const UpdatesPage = ({ isArabic }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const t = isArabic ? {
    updates: "التحديثات",
    all: "الكل",
    features: "ميزات جديدة",
    improvements: "تحسينات",
    fixes: "إصلاحات",
    security: "أمان",
    markAllRead: "تحديد الكل كمقروء",
    newFeature: "ميزة جديدة",
    improvement: "تحسين",
    bugFix: "إصلاح خطأ",
    securityUpdate: "تحديث أمني",
    today: "اليوم",
    yesterday: "أمس",
    thisWeek: "هذا الأسبوع",
    lastWeek: "الأسبوع الماضي"
  } : {
    updates: "Updates",
    all: "All",
    features: "Features",
    improvements: "Improvements",
    fixes: "Bug Fixes",
    security: "Security",
    markAllRead: "Mark All as Read",
    newFeature: "New Feature",
    improvement: "Improvement",
    bugFix: "Bug Fix",
    securityUpdate: "Security Update",
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    lastWeek: "Last Week"
  };

  const [updates] = useState([
    {
      id: 1,
      type: 'feature',
      title: 'Profile Management Enhanced',
      description: 'You can now update your profile photo, change your password, and edit personal information directly from the profile page.',
      date: new Date(),
      icon: '✨',
      read: false,
      category: t.newFeature
    },
    {
      id: 2,
      type: 'feature',
      title: 'Settings Page Added',
      description: 'New comprehensive settings page allows you to customize notifications, appearance, language preferences, and regional settings.',
      date: new Date(Date.now() - 86400000),
      icon: '⚙️',
      read: false,
      category: t.newFeature
    },
    {
      id: 3,
      type: 'improvement',
      title: 'Dark Mode Enhanced',
      description: 'Improved dark mode with better contrast and smoother transitions across all pages.',
      date: new Date(Date.now() - 86400000 * 2),
      icon: '🌙',
      read: false,
      category: t.improvement
    },
    {
      id: 4,
      type: 'feature',
      title: 'Reservation Management System',
      description: 'Complete reservation management with add, edit, delete, duplicate, and export features. Context menu for quick actions.',
      date: new Date(Date.now() - 86400000 * 3),
      icon: '📋',
      read: true,
      category: t.newFeature
    },
    {
      id: 5,
      type: 'improvement',
      title: 'User Interface Improvements',
      description: 'Enhanced UI with better animations, smoother transitions, and improved responsive design for mobile devices.',
      date: new Date(Date.now() - 86400000 * 5),
      icon: '🎨',
      read: true,
      category: t.improvement
    },
    {
      id: 6,
      type: 'security',
      title: 'Enhanced Security Features',
      description: 'Implemented JWT authentication, password hashing with bcrypt, and secure API endpoints.',
      date: new Date(Date.now() - 86400000 * 7),
      icon: '🔒',
      read: true,
      category: t.securityUpdate
    },
    {
      id: 7,
      type: 'fix',
      title: 'Login Performance Optimized',
      description: 'Fixed slow login times and improved authentication response speed.',
      date: new Date(Date.now() - 86400000 * 8),
      icon: '🔧',
      read: true,
      category: t.bugFix
    },
    {
      id: 8,
      type: 'feature',
      title: 'Backend Integration Complete',
      description: 'Full Node.js backend with MongoDB database for users, roles, and reservations management.',
      date: new Date(Date.now() - 86400000 * 10),
      icon: '💾',
      read: true,
      category: t.newFeature
    },
    {
      id: 9,
      type: 'improvement',
      title: 'Reports Page Redesigned',
      description: 'New clean layout for reports with organized buttons for all report types.',
      date: new Date(Date.now() - 86400000 * 12),
      icon: '📊',
      read: true,
      category: t.improvement
    },
    {
      id: 10,
      type: 'feature',
      title: 'Multilingual Support',
      description: 'Added full Arabic and English language support with RTL layout for Arabic.',
      date: new Date(Date.now() - 86400000 * 14),
      icon: '🌐',
      read: true,
      category: t.newFeature
    }
  ]);

  const getTimeCategory = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t.today;
    if (diffDays === 1) return t.yesterday;
    if (diffDays <= 7) return t.thisWeek;
    return t.lastWeek;
  };

  const filteredUpdates = updates.filter(update => {
    if (activeFilter === 'all') return true;
    return update.type === activeFilter;
  });

  const groupedUpdates = filteredUpdates.reduce((groups, update) => {
    const category = getTimeCategory(update.date);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(update);
    return groups;
  }, {});

  const getUpdateTypeClass = (type) => {
    switch (type) {
      case 'feature': return 'update-type-feature';
      case 'improvement': return 'update-type-improvement';
      case 'fix': return 'update-type-fix';
      case 'security': return 'update-type-security';
      default: return 'update-type-default';
    }
  };

  return (
    <div className="updates-page">
      <div className="updates-header">
        <h1 className="updates-title">{t.updates}</h1>
        <button className="mark-all-read-btn">
          ✓ {t.markAllRead}
        </button>
      </div>

      <div className="updates-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          📋 {t.all}
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'feature' ? 'active' : ''}`}
          onClick={() => setActiveFilter('feature')}
        >
          ✨ {t.features}
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'improvement' ? 'active' : ''}`}
          onClick={() => setActiveFilter('improvement')}
        >
          🎨 {t.improvements}
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'fix' ? 'active' : ''}`}
          onClick={() => setActiveFilter('fix')}
        >
          🔧 {t.fixes}
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'security' ? 'active' : ''}`}
          onClick={() => setActiveFilter('security')}
        >
          🔒 {t.security}
        </button>
      </div>

      <div className="updates-content">
        {Object.entries(groupedUpdates).map(([timeCategory, categoryUpdates]) => (
          <div key={timeCategory} className="updates-group">
            <h2 className="updates-group-title">{timeCategory}</h2>
            <div className="updates-list">
              {categoryUpdates.map(update => (
                <div 
                  key={update.id} 
                  className={`update-item ${update.read ? 'read' : 'unread'}`}
                >
                  <div className="update-icon">{update.icon}</div>
                  <div className="update-content">
                    <div className="update-header">
                      <h3 className="update-title">{update.title}</h3>
                      <span className={`update-type ${getUpdateTypeClass(update.type)}`}>
                        {update.category}
                      </span>
                    </div>
                    <p className="update-description">{update.description}</p>
                    <div className="update-meta">
                      <span className="update-date">
                        {update.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  {!update.read && <div className="update-unread-indicator"></div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdatesPage;

