import React, { useState, useEffect } from 'react';

const SettingsPage = ({ isArabic, isDarkMode, onToggleDarkMode, onToggleLanguage }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    soundEffects: true,
    autoSave: true,
    compactView: false,
    showTutorials: true,
    itemsPerPage: 10,
    dateFormat: 'MM/DD/YYYY',
    timeZone: 'UTC',
    currency: 'USD'
  });

  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const t = isArabic ? {
    settings: "الإعدادات",
    general: "عام",
    notifications: "الإشعارات",
    appearance: "المظهر",
    regional: "الإقليمية",
    language: "اللغة",
    darkMode: "الوضع الداكن",
    enableNotifications: "تفعيل الإشعارات",
    emailNotifications: "إشعارات البريد الإلكتروني",
    soundEffects: "المؤثرات الصوتية",
    autoSave: "الحفظ التلقائي",
    compactView: "عرض مضغوط",
    showTutorials: "إظهار الدروس التعليمية",
    itemsPerPage: "العناصر لكل صفحة",
    dateFormat: "تنسيق التاريخ",
    timeZone: "المنطقة الزمنية",
    currency: "العملة",
    saveSettings: "حفظ الإعدادات",
    settingsSaved: "تم حفظ الإعدادات بنجاح",
    english: "English",
    arabic: "العربية",
    generalSettings: "الإعدادات العامة",
    notificationSettings: "إعدادات الإشعارات",
    appearanceSettings: "إعدادات المظهر",
    regionalSettings: "الإعدادات الإقليمية"
  } : {
    settings: "Settings",
    general: "General",
    notifications: "Notifications",
    appearance: "Appearance",
    regional: "Regional",
    language: "Language",
    darkMode: "Dark Mode",
    enableNotifications: "Enable Notifications",
    emailNotifications: "Email Notifications",
    soundEffects: "Sound Effects",
    autoSave: "Auto Save",
    compactView: "Compact View",
    showTutorials: "Show Tutorials",
    itemsPerPage: "Items Per Page",
    dateFormat: "Date Format",
    timeZone: "Time Zone",
    currency: "Currency",
    saveSettings: "Save Settings",
    settingsSaved: "Settings saved successfully",
    english: "English",
    arabic: "العربية",
    generalSettings: "General Settings",
    notificationSettings: "Notification Settings",
    appearanceSettings: "Appearance Settings",
    regionalSettings: "Regional Settings"
  };

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('ehm_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (name) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSelectChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('ehm_settings', JSON.stringify(settings));
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">{t.settings}</h1>
      </div>

      <div className="settings-content">
        {/* Appearance Settings */}
        <div className="settings-section">
          <h2 className="settings-section-title">
            <span className="section-icon">🎨</span>
            {t.appearanceSettings}
          </h2>
          <div className="settings-grid">
            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.language}</label>
                <p className="settings-description">
                  {isArabic ? "اختر لغة الواجهة" : "Choose interface language"}
                </p>
              </div>
              <div className="settings-control">
                <select 
                  className="settings-select"
                  value={isArabic ? 'ar' : 'en'}
                  onChange={(e) => onToggleLanguage && onToggleLanguage()}
                >
                  <option value="en">{t.english}</option>
                  <option value="ar">{t.arabic}</option>
                </select>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.darkMode}</label>
                <p className="settings-description">
                  {isArabic ? "تفعيل الوضع الداكن للواجهة" : "Enable dark theme for the interface"}
                </p>
              </div>
              <div className="settings-control">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={isDarkMode}
                    onChange={onToggleDarkMode}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.compactView}</label>
                <p className="settings-description">
                  {isArabic ? "عرض مضغوط لتوفير المساحة" : "Compact layout to save space"}
                </p>
              </div>
              <div className="settings-control">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.compactView}
                    onChange={() => handleToggle('compactView')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <h2 className="settings-section-title">
            <span className="section-icon">🔔</span>
            {t.notificationSettings}
          </h2>
          <div className="settings-grid">
            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.enableNotifications}</label>
                <p className="settings-description">
                  {isArabic ? "تلقي الإشعارات في الوقت الفعلي" : "Receive real-time notifications"}
                </p>
              </div>
              <div className="settings-control">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications}
                    onChange={() => handleToggle('notifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.emailNotifications}</label>
                <p className="settings-description">
                  {isArabic ? "تلقي الإشعارات عبر البريد الإلكتروني" : "Receive notifications via email"}
                </p>
              </div>
              <div className="settings-control">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.soundEffects}</label>
                <p className="settings-description">
                  {isArabic ? "تشغيل الأصوات للإشعارات" : "Play sounds for notifications"}
                </p>
              </div>
              <div className="settings-control">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.soundEffects}
                    onChange={() => handleToggle('soundEffects')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="settings-section">
          <h2 className="settings-section-title">
            <span className="section-icon">⚙️</span>
            {t.generalSettings}
          </h2>
          <div className="settings-grid">
            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.autoSave}</label>
                <p className="settings-description">
                  {isArabic ? "حفظ التغييرات تلقائياً" : "Automatically save changes"}
                </p>
              </div>
              <div className="settings-control">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.autoSave}
                    onChange={() => handleToggle('autoSave')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.showTutorials}</label>
                <p className="settings-description">
                  {isArabic ? "إظهار الدروس التعليمية للمبتدئين" : "Show tutorials for new features"}
                </p>
              </div>
              <div className="settings-control">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.showTutorials}
                    onChange={() => handleToggle('showTutorials')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.itemsPerPage}</label>
                <p className="settings-description">
                  {isArabic ? "عدد العناصر المعروضة في كل صفحة" : "Number of items displayed per page"}
                </p>
              </div>
              <div className="settings-control">
                <select 
                  className="settings-select"
                  value={settings.itemsPerPage}
                  onChange={(e) => handleSelectChange('itemsPerPage', parseInt(e.target.value))}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="settings-section">
          <h2 className="settings-section-title">
            <span className="section-icon">🌍</span>
            {t.regionalSettings}
          </h2>
          <div className="settings-grid">
            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.dateFormat}</label>
                <p className="settings-description">
                  {isArabic ? "تنسيق عرض التاريخ" : "Date display format"}
                </p>
              </div>
              <div className="settings-control">
                <select 
                  className="settings-select"
                  value={settings.dateFormat}
                  onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.timeZone}</label>
                <p className="settings-description">
                  {isArabic ? "المنطقة الزمنية المحلية" : "Local time zone"}
                </p>
              </div>
              <div className="settings-control">
                <select 
                  className="settings-select"
                  value={settings.timeZone}
                  onChange={(e) => handleSelectChange('timeZone', e.target.value)}
                >
                  <option value="UTC">UTC (GMT+0)</option>
                  <option value="Africa/Cairo">Cairo (GMT+2)</option>
                  <option value="Asia/Dubai">Dubai (GMT+4)</option>
                  <option value="Asia/Riyadh">Riyadh (GMT+3)</option>
                </select>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <label className="settings-label">{t.currency}</label>
                <p className="settings-description">
                  {isArabic ? "العملة الافتراضية" : "Default currency"}
                </p>
              </div>
              <div className="settings-control">
                <select 
                  className="settings-select"
                  value={settings.currency}
                  onChange={(e) => handleSelectChange('currency', e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EGP">EGP (E£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="SAR">SAR (﷼)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="settings-save-btn" onClick={handleSaveSettings}>
            💾 {t.saveSettings}
          </button>
        </div>
      </div>

      {showSuccessToast && (
        <div className="toast-notification toast-show toast-success">
          {t.settingsSaved}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

