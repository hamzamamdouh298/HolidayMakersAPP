import React, { useState, useEffect } from 'react';
import { itinerariesAPI } from '../services/api';
import '../styles/ItineraryPage.css';

const ItineraryPage = ({ isArabic, t }) => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    scheduled: false,
    fileNumber: '',
    location: '',
    remarker: '',
    confirmation: '',
    roomType: '',
    transportation: '',
    supplier: '',
    clientName: '',
    agent: '',
    operator: '',
    accommodation: '',
    pax: 0,
    time: '00:00',
    itinerary: '',
    bookingNar: ''
  });

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const response = await itinerariesAPI.getAll();
      if (response.status === 'success') {
        setItineraries(response.data.itineraries || []);
      }
    } catch (error) {
      console.error('Failed to fetch itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const clearForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      scheduled: false,
      fileNumber: '',
      location: '',
      remarker: '',
      confirmation: '',
      roomType: '',
      transportation: '',
      supplier: '',
      clientName: '',
      agent: '',
      operator: '',
      accommodation: '',
      pax: 0,
      time: '00:00',
      itinerary: '',
      bookingNar: ''
    });
  };

  const handleAddItinerary = async () => {
    try {
      const itineraryData = {
        ...formData,
        date: new Date(formData.date),
        pax: parseInt(formData.pax) || 0
      };

      const response = await itinerariesAPI.create(itineraryData);
      if (response.status === 'success') {
        await fetchItineraries();
        setShowAddModal(false);
        clearForm();
      }
    } catch (error) {
      console.error('Failed to add itinerary:', error);
      alert('Failed to add itinerary: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteItinerary = async (id) => {
    if (window.confirm(isArabic ? 'هل أنت متأكد من حذف هذا الإيتينيراري؟' : 'Are you sure you want to delete this itinerary?')) {
      try {
        await itinerariesAPI.delete(id);
        await fetchItineraries();
      } catch (error) {
        console.error('Failed to delete itinerary:', error);
        alert('Failed to delete itinerary: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const filteredItineraries = itineraries.filter(itinerary => {
    const search = searchTerm.toLowerCase();
    return (
      itinerary.fileNumber?.toLowerCase().includes(search) ||
      itinerary.clientName?.toLowerCase().includes(search) ||
      itinerary.agent?.toLowerCase().includes(search) ||
      itinerary.itinerary?.toLowerCase().includes(search)
    );
  });

  const downloadExcel = () => {
    const headers = ['ID', 'Date', 'Scheduled', 'File Number', 'Location', 'Remarker', 'Confirmation', 'Room Type', 'Transportation', 'Supplier', 'Client Name', 'Agent', 'Operator', 'Accommodation', 'Pax', 'Time', 'Itinerary', 'Booking Nar'];
    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(',') + "\n"
      + filteredItineraries.map((it, index) => {
        const date = it.date ? new Date(it.date).toLocaleDateString() : '';
        return `${index + 1},${date},${it.scheduled ? '✓' : ''},${it.fileNumber || ''},${it.location || ''},${it.remarker || ''},${it.confirmation || ''},${it.roomType || ''},${it.transportation || ''},${it.supplier || ''},${it.clientName || ''},${it.agent || ''},${it.operator || ''},${it.accommodation || ''},${it.pax || 0},${it.time || '00:00'},${it.itinerary || ''},${it.bookingNar || ''}`;
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "itineraries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="itinerary-page"><div className="loading-message">Loading itineraries...</div></div>;
  }

  return (
    <div className="itinerary-page">
      <div className="itinerary-header">
        <h1>{isArabic ? 'الإيتينيراري' : 'Itinerary'}</h1>
      </div>

      <div className="itinerary-actions">
        <div className="itinerary-actions-left">
          <button className="search-btn-blue" onClick={() => setShowSearchModal(true)}>
            <span className="btn-icon">🔍</span>
            {isArabic ? 'بحث' : 'Search'}
          </button>
          <button className="add-btn-green" onClick={() => setShowAddModal(true)}>
            <span className="btn-icon">➕</span>
            {isArabic ? 'إضافة' : 'Add'}
          </button>
        </div>
        <button className="export-excel-btn" onClick={downloadExcel}>
          <span className="btn-icon">📊</span>
          {isArabic ? 'تصدير Excel' : 'Export Excel'}
        </button>
      </div>

      <div className="itinerary-table-container">
        <table className="itinerary-table">
          <thead>
            <tr>
              <th>{isArabic ? 'الرقم' : 'ID'}</th>
              <th>{isArabic ? 'التاريخ' : 'Date'}</th>
              <th>{isArabic ? 'مجدول' : 'Scheduled'}</th>
              <th>{isArabic ? 'رقم الملف' : 'File Number'}</th>
              <th>{isArabic ? 'الموقع' : 'Location'}</th>
              <th>{isArabic ? 'ملاحظات' : 'Remarker'}</th>
              <th>{isArabic ? 'التأكيد' : 'Confirmation'}</th>
              <th>{isArabic ? 'نوع الغرفة' : 'Room Type'}</th>
              <th>{isArabic ? 'النقل' : 'Transportation'}</th>
              <th>{isArabic ? 'المورد' : 'Supplier'}</th>
              <th>{isArabic ? 'اسم العميل' : 'Client Name'}</th>
              <th>{isArabic ? 'الوكيل' : 'Agent'}</th>
              <th>{isArabic ? 'المشغل' : 'Operator'}</th>
              <th>{isArabic ? 'الإقامة' : 'Accommodation'}</th>
              <th>{isArabic ? 'عدد المسافرين' : 'Pax'}</th>
              <th>{isArabic ? 'الوقت' : 'Time'}</th>
              <th>{isArabic ? 'الإيتينيراري' : 'Itinerary'}</th>
              <th>{isArabic ? 'ملاحظات الحجز' : 'Booking Nar'}</th>
              <th>{isArabic ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredItineraries.length === 0 ? (
              <tr>
                <td colSpan="19" className="no-data">
                  {isArabic ? 'لا توجد إيتينيراري' : 'No itineraries found'}
                </td>
              </tr>
            ) : (
              filteredItineraries.map((it, index) => (
                <tr key={it._id}>
                  <td>{itineraries.length - index}</td>
                  <td>{it.date ? new Date(it.date).toLocaleDateString() : ''}</td>
                  <td>{it.scheduled ? '✓' : ''}</td>
                  <td>{it.fileNumber}</td>
                  <td>{it.location || '-'}</td>
                  <td>{it.remarker || '-'}</td>
                  <td>{it.confirmation || '-'}</td>
                  <td>{it.roomType || '-'}</td>
                  <td>{it.transportation || '-'}</td>
                  <td>{it.supplier || '-'}</td>
                  <td>{it.clientName || '-'}</td>
                  <td>{it.agent || '-'}</td>
                  <td>{it.operator || '-'}</td>
                  <td>{it.accommodation || '-'}</td>
                  <td>{it.pax || 0}</td>
                  <td>{it.time || '00:00'}</td>
                  <td>{it.itinerary || '-'}</td>
                  <td>{it.bookingNar || '-'}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteItinerary(it._id)}
                      title={isArabic ? 'حذف' : 'Delete'}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="itinerary-footer">
        <span className="result-text">
          {isArabic ? 'النتيجة' : 'Result'}: {filteredItineraries.length} {isArabic ? 'من' : 'of'} {itineraries.length} {isArabic ? 'الإجمالي' : 'Total'}
        </span>
      </div>

      {/* Add Itinerary Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); clearForm(); }}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isArabic ? 'إضافة إيتينيراري' : 'Add Itinerary'}</h2>
              <button className="modal-close" onClick={() => { setShowAddModal(false); clearForm(); }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-field">
                  <label>{isArabic ? 'التاريخ' : 'Date'} <span className="required">*</span></label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>{isArabic ? 'رقم الملف' : 'File Number'} <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.fileNumber}
                    onChange={(e) => handleFormChange('fileNumber', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>{isArabic ? 'مجدول' : 'Scheduled'}</label>
                  <input
                    type="checkbox"
                    checked={formData.scheduled}
                    onChange={(e) => handleFormChange('scheduled', e.target.checked)}
                  />
                </div>
                <div className="form-field">
                  <label>{isArabic ? 'اسم العميل' : 'Client Name'}</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleFormChange('clientName', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>{isArabic ? 'الوكيل' : 'Agent'}</label>
                  <input
                    type="text"
                    value={formData.agent}
                    onChange={(e) => handleFormChange('agent', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>{isArabic ? 'المشغل' : 'Operator'}</label>
                  <input
                    type="text"
                    value={formData.operator}
                    onChange={(e) => handleFormChange('operator', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>{isArabic ? 'عدد المسافرين' : 'Pax'}</label>
                  <input
                    type="number"
                    value={formData.pax}
                    onChange={(e) => handleFormChange('pax', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>{isArabic ? 'الوقت' : 'Time'}</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleFormChange('time', e.target.value)}
                  />
                </div>
                <div className="form-field full-width">
                  <label>{isArabic ? 'الإيتينيراري' : 'Itinerary'}</label>
                  <textarea
                    value={formData.itinerary}
                    onChange={(e) => handleFormChange('itinerary', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="form-field full-width">
                  <label>{isArabic ? 'ملاحظات الحجز' : 'Booking Nar'}</label>
                  <textarea
                    value={formData.bookingNar}
                    onChange={(e) => handleFormChange('bookingNar', e.target.value)}
                    rows="2"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="clear-btn" onClick={clearForm}>
                {isArabic ? 'مسح' : 'Clear'}
              </button>
              <button className="save-btn" onClick={handleAddItinerary}>
                {isArabic ? 'إضافة' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isArabic ? 'بحث في الإيتينيراري' : 'Search Itineraries'}</h2>
              <button className="modal-close" onClick={() => setShowSearchModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-field">
                <label>{isArabic ? 'البحث' : 'Search'}</label>
                <input
                  type="text"
                  placeholder={isArabic ? 'ابحث حسب رقم الملف، اسم العميل، الوكيل، أو الإيتينيراري' : 'Search by file number, client name, agent, or itinerary'}
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

export default ItineraryPage;

