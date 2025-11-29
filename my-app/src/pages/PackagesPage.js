import React, { useState, useEffect } from 'react';
import { packagesAPI } from '../services/api';
import AddPackageModal from '../components/AddPackageModal';
import '../styles/PackagesPage.css';

const PackagesPage = ({ isArabic, t }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [formData, setFormData] = useState({
    packageName: '',
    noDays: '',
    pricePerAdult: '',
    pricePerChild: '',
    currency: 'EGP',
    priceInclude: '',
    priceNotInclude: '',
    enabled: true
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await packagesAPI.getAll();
      if (response.status === 'success') {
        setPackages(response.data.packages || []);
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const clearForm = () => {
    setFormData({
      packageName: '',
      noDays: '',
      pricePerAdult: '',
      pricePerChild: '',
      currency: 'EGP',
      priceInclude: '',
      priceNotInclude: '',
      enabled: true
    });
  };

  const handleAddPackage = async () => {
    try {
      const packageData = {
        ...formData,
        noDays: parseInt(formData.noDays) || 1,
        pricePerAdult: parseFloat(formData.pricePerAdult) || 0,
        pricePerChild: parseFloat(formData.pricePerChild) || 0
      };

      const response = await packagesAPI.create(packageData);
      if (response.status === 'success') {
        await fetchPackages();
        setShowAddModal(false);
        clearForm();
      }
    } catch (error) {
      console.error('Failed to add package:', error);
      alert('Failed to add package: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm(isArabic ? 'هل أنت متأكد من حذف هذه الباقة؟' : 'Are you sure you want to delete this package?')) {
      try {
        await packagesAPI.delete(id);
        await fetchPackages();
      } catch (error) {
        console.error('Failed to delete package:', error);
        alert('Failed to delete package: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const toggleEnabled = async (id, currentEnabled) => {
    try {
      await packagesAPI.update(id, { enabled: !currentEnabled });
      await fetchPackages();
    } catch (error) {
      console.error('Failed to update package:', error);
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const search = searchTerm.toLowerCase();
    return (
      pkg.packageName?.toLowerCase().includes(search) ||
      pkg.currency?.toLowerCase().includes(search)
    );
  });

  const downloadExcel = () => {
    const headers = ['ID', 'Package Name', 'No. Days', 'Price/adult', 'Price/Child', 'currency', 'Price Include', 'Price Not Include', 'Enabled'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n"
      + filteredPackages.map((pkg, index) => 
          `${index + 1},${pkg.packageName || ''},${pkg.noDays || ''},${pkg.pricePerAdult || ''},${pkg.pricePerChild || ''},${pkg.currency || ''},"${pkg.priceInclude || ''}","${pkg.priceNotInclude || ''}",${pkg.enabled ? 'Enabled' : 'Disabled'}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "packages.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="packages-page"><div className="loading-message">Loading packages...</div></div>;
  }

  const formatCurrency = (currency) => {
    const currencyMap = {
      'EGP': 'جنيه مصري',
      'USD': 'دولار أمريكي',
      'EUR': 'يورو',
      'SAR': 'ريال سعودي',
      'GBP': 'جنيه إسترليني',
      'AED': 'درهم إماراتي'
    };
    return currencyMap[currency] || currency || '-';
  };

  return (
    <div className="packages-page">
      <div className="packages-header">
        <h1>Packages</h1>
        <div className="packages-header-actions">
          <button className="search-btn-blue" onClick={() => setShowSearchModal(true)}>
            <span className="btn-icon">🔍</span>
            Search
          </button>
          <button className="add-btn-green" onClick={() => setShowAddModal(true)}>
            <span className="btn-icon">➕</span>
            Add
          </button>
        </div>
      </div>

      <div className="packages-table-container">
        <table className="packages-table">
          <thead>
            <tr>
              <th>
                serialId <span className="sort-arrow">⌄</span>
              </th>
              <th>Package Name</th>
              <th>No. Days</th>
              <th>Price/adult</th>
              <th>Price/Child</th>
              <th>currency</th>
              <th>Price Include</th>
              <th>Price Not Include</th>
              <th>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackages.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No packages found
                </td>
              </tr>
            ) : (
              filteredPackages.map((pkg) => (
                <tr key={pkg._id}>
                  <td>{pkg.serialId || '-'}</td>
                  <td>{pkg.packageName || '-'}</td>
                  <td>{pkg.noDays || '-'}</td>
                  <td>{pkg.pricePerAdult || '-'}</td>
                  <td>{pkg.pricePerChild || '-'}</td>
                  <td>{formatCurrency(pkg.currency)}</td>
                  <td>{pkg.priceInclude || '-'}</td>
                  <td>{pkg.priceNotInclude || '-'}</td>
                  <td>
                    <button 
                      className={`enabled-toggle ${pkg.enabled ? 'enabled-yes' : 'enabled-no'}`}
                      onClick={() => toggleEnabled(pkg._id, pkg.enabled)}
                    >
                      {pkg.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="packages-footer">
        <span className="result-text">
          Result: <strong>{filteredPackages.length}</strong> of <strong>{packages.length}</strong> Total
        </span>
      </div>

      {/* Add Package Modal */}
      {showAddModal && (
        <AddPackageModal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); clearForm(); }}
          onSuccess={async () => {
            await fetchPackages();
            setShowAddModal(false);
            clearForm();
          }}
          package={null}
        />
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isArabic ? 'بحث' : 'Search'}</h2>
              <button className="modal-close" onClick={() => setShowSearchModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-field">
                <label>{isArabic ? 'اسم الباقة' : 'Package Name'}</label>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="clear-btn" onClick={() => setSearchTerm('')}>
                {isArabic ? 'مسح' : 'Clear'}
              </button>
              <button className="save-btn" onClick={() => setShowSearchModal(false)}>
                {isArabic ? 'بحث' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesPage;

