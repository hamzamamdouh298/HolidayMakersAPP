import React, { useState } from 'react';
import '../styles/SuppliersPage.css';

const SuppliersPage = ({ isArabic, suppliers = [] }) => {

  const [searchFilters, setSearchFilters] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    branch: '',
    supplierCode: '',
    code: '',
    status: 'All'
  });

  const [showSearchModal, setShowSearchModal] = useState(false);

  // Translations
  const t = isArabic ? {
    suppliersPage: 'الموردين',
    search: 'بحث',
    downloadExcel: 'تحميل Excel',
    import: 'استيراد',
    id: 'الرقم',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    country: 'الدولة',
    city: 'المدينة',
    branch: 'الفرع',
    supplierCode: 'كود المورد',
    code: 'الكود',
    taxNumber: 'الرقم الضريبي',
    mc: 'MC',
    status: 'الحالة',
    createdBy: 'أنشئ بواسطة',
    createdAt: 'تاريخ الإنشاء',
    result: 'النتيجة',
    of: 'من',
    total: 'الإجمالي',
    searchData: 'بحث في البيانات',
    clear: 'مسح',
    enabled: 'مفعل',
    disabled: 'غير مفعل',
    all: 'الكل'
  } : {
    suppliersPage: 'Suppliers',
    search: 'Search',
    downloadExcel: 'Download Excel',
    import: 'Import',
    id: 'ID',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    country: 'Country',
    city: 'City',
    branch: 'Branch',
    supplierCode: 'supplier code',
    code: 'code',
    taxNumber: 'Tax Number',
    mc: 'MC',
    status: 'Status',
    createdBy: 'Created by',
    createdAt: 'Created At',
    result: 'Result',
    of: 'of',
    total: 'Total',
    searchData: 'Search Data',
    clear: 'Clear',
    enabled: 'Enabled',
    disabled: 'Disabled',
    all: 'All'
  };

  const handleSearchFilterChange = (field, value) => {
    setSearchFilters({
      ...searchFilters,
      [field]: value
    });
  };

  const clearSearchFilters = () => {
    setSearchFilters({
      name: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      branch: '',
      supplierCode: '',
      code: '',
      status: 'All'
    });
  };

  const performSearch = () => {
    console.log('Searching with filters:', searchFilters);
    setShowSearchModal(false);
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    if (searchFilters.name && !supplier.name.toLowerCase().includes(searchFilters.name.toLowerCase())) {
      return false;
    }
    if (searchFilters.email && supplier.email !== '-' && !supplier.email.toLowerCase().includes(searchFilters.email.toLowerCase())) {
      return false;
    }
    if (searchFilters.phone && supplier.phone !== '-' && !supplier.phone.includes(searchFilters.phone)) {
      return false;
    }
    if (searchFilters.country && supplier.country !== '-' && !supplier.country.toLowerCase().includes(searchFilters.country.toLowerCase())) {
      return false;
    }
    if (searchFilters.city && supplier.city !== '-' && !supplier.city.toLowerCase().includes(searchFilters.city.toLowerCase())) {
      return false;
    }
    if (searchFilters.branch && !supplier.branch.toLowerCase().includes(searchFilters.branch.toLowerCase())) {
      return false;
    }
    if (searchFilters.supplierCode && !supplier.supplierCode.includes(searchFilters.supplierCode)) {
      return false;
    }
    if (searchFilters.code && !supplier.code.includes(searchFilters.code)) {
      return false;
    }
    if (searchFilters.status !== 'All' && supplier.status !== searchFilters.status.toLowerCase()) {
      return false;
    }
    return true;
  });

  const downloadExcel = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Country', 'City', 'Branch', 'Supplier Code', 'Code', 'Tax Number', 'MC', 'Status', 'Created By', 'Created At'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n"
      + filteredSuppliers.map(supplier => 
          `${supplier.id},${supplier.name},${supplier.email},${supplier.phone},${supplier.country},${supplier.city},${supplier.branch},${supplier.supplierCode},${supplier.code},${supplier.taxNumber},${supplier.mc},${supplier.status},${supplier.createdBy},${supplier.createdAt}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "suppliers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    alert('Import functionality coming soon!');
  };

  return (
    <div className="suppliers-page">
      <div className="suppliers-header">
        <h1 className="suppliers-title">{t.suppliersPage}</h1>
      </div>

      <div className="suppliers-actions">
        <div className="suppliers-actions-left">
          <button className="search-btn-standalone" onClick={() => setShowSearchModal(true)}>
            <span className="btn-icon">🔍</span>
            {t.search}
          </button>
        </div>
        <div className="suppliers-actions-right">
          <button className="download-excel-btn" onClick={downloadExcel}>
            <span className="btn-icon">📥</span>
            {t.downloadExcel}
          </button>
          <button className="cloud-btn" title="Cloud">
            <span className="btn-icon">☁️</span>
          </button>
          <button className="import-btn" onClick={handleImport}>
            <span className="btn-icon">📤</span>
            {t.import}
          </button>
        </div>
      </div>

      <div className="suppliers-table-container">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th className="sortable">
                {t.id}
                <span className="sort-icon">⌄</span>
              </th>
              <th>{t.name}</th>
              <th>{t.email}</th>
              <th>{t.phone}</th>
              <th>{t.country}</th>
              <th>{t.city}</th>
              <th>{t.branch}</th>
              <th>{t.supplierCode}</th>
              <th>{t.code}</th>
              <th>{t.taxNumber}</th>
              <th>{t.mc}</th>
              <th>{t.status}</th>
              <th>{t.createdBy}</th>
              <th>{t.createdAt}</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="14" className="empty-message">
                  {suppliers.length === 0 ? 'No suppliers added yet' : 'No suppliers match the search criteria'}
                </td>
              </tr>
            ) : (
              filteredSuppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td>{supplier.id}</td>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.country}</td>
                  <td>{supplier.city}</td>
                  <td>{supplier.branch}</td>
                  <td>{supplier.supplierCode}</td>
                  <td>{supplier.code}</td>
                  <td>{supplier.taxNumber}</td>
                  <td>{supplier.mc}</td>
                  <td>
                    <span className={`status-badge status-${supplier.status}`}>
                      {supplier.status === 'enabled' ? t.enabled : t.disabled}
                    </span>
                  </td>
                  <td>{supplier.createdBy}</td>
                  <td>{supplier.createdAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="suppliers-footer">
        <span className="result-text">
          {t.result}: {filteredSuppliers.length} {t.of} {suppliers.length} {t.total}
        </span>
        <div className="pagination">
          <button className="pagination-refresh">🔄</button>
          <select className="pagination-select">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="search-modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <div className="search-modal-title">
                <span className="search-modal-icon">🔍</span>
                <h2>{t.searchData}</h2>
              </div>
              <button className="modal-close" onClick={() => setShowSearchModal(false)}>✕</button>
            </div>
            
            <div className="search-modal-body">
              <div className="search-form-grid">
                {/* Name */}
                <div className="search-form-field">
                  <label className="search-label">{t.name}</label>
                  <input 
                    type="text" 
                    className="search-form-input"
                    value={searchFilters.name}
                    onChange={(e) => handleSearchFilterChange('name', e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="search-form-field">
                  <label className="search-label">{t.email}</label>
                  <input 
                    type="text" 
                    className="search-form-input"
                    value={searchFilters.email}
                    onChange={(e) => handleSearchFilterChange('email', e.target.value)}
                  />
                </div>

                {/* Phone */}
                <div className="search-form-field">
                  <label className="search-label">{t.phone}</label>
                  <input 
                    type="text" 
                    className="search-form-input"
                    value={searchFilters.phone}
                    onChange={(e) => handleSearchFilterChange('phone', e.target.value)}
                  />
                </div>

                {/* Country */}
                <div className="search-form-field">
                  <label className="search-label">{t.country}</label>
                  <input 
                    type="text" 
                    className="search-form-input"
                    value={searchFilters.country}
                    onChange={(e) => handleSearchFilterChange('country', e.target.value)}
                  />
                </div>

                {/* City */}
                <div className="search-form-field">
                  <label className="search-label">{t.city}</label>
                  <input 
                    type="text" 
                    className="search-form-input"
                    value={searchFilters.city}
                    onChange={(e) => handleSearchFilterChange('city', e.target.value)}
                  />
                </div>

                {/* Branch */}
                <div className="search-form-field">
                  <label className="search-label">{t.branch}</label>
                  <input 
                    type="text" 
                    className="search-form-input"
                    value={searchFilters.branch}
                    onChange={(e) => handleSearchFilterChange('branch', e.target.value)}
                  />
                </div>

                {/* Supplier Code */}
                <div className="search-form-field">
                  <label className="search-label">{t.supplierCode}</label>
                  <input 
                    type="text" 
                    className="search-form-input"
                    value={searchFilters.supplierCode}
                    onChange={(e) => handleSearchFilterChange('supplierCode', e.target.value)}
                  />
                </div>

                {/* Code */}
                <div className="search-form-field">
                  <label className="search-label">{t.code}</label>
                  <input 
                    type="text" 
                    className="search-form-input"
                    value={searchFilters.code}
                    onChange={(e) => handleSearchFilterChange('code', e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="search-form-field">
                  <label className="search-label">{t.status}</label>
                  <select 
                    className="search-form-select"
                    value={searchFilters.status}
                    onChange={(e) => handleSearchFilterChange('status', e.target.value)}
                  >
                    <option>{t.all}</option>
                    <option value="enabled">{t.enabled}</option>
                    <option value="disabled">{t.disabled}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="search-modal-footer">
              <button className="search-clear-btn" onClick={clearSearchFilters}>
                {t.clear}
              </button>
              <button className="search-submit-btn" onClick={performSearch}>
                <span className="btn-icon">🔍</span>
                {t.search}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;

