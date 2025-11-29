import React, { useState, useEffect } from 'react';
import { tourGuideSchedulesAPI } from '../services/api';
import '../styles/TourGuideSchedulePage.css';

const TourGuideSchedulePage = ({ isArabic, t }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    guideName: '',
    tourDetails: '',
    clientName: '',
    fileNumber: '',
    location: '',
    startTime: '00:00',
    endTime: '00:00',
    pax: 0,
    notes: '',
    status: 'Pending'
  });

  useEffect(() => {
    fetchSchedules();
  }, [selectedDate]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await tourGuideSchedulesAPI.getAll({ date: selectedDate });
      if (response.status === 'success') {
        setSchedules(response.data.schedules || []);
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
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
      guideName: '',
      tourDetails: '',
      clientName: '',
      fileNumber: '',
      location: '',
      startTime: '00:00',
      endTime: '00:00',
      pax: 0,
      notes: '',
      status: 'Pending'
    });
  };

  const handleAddSchedule = async () => {
    try {
      const scheduleData = {
        ...formData,
        date: new Date(formData.date),
        pax: parseInt(formData.pax) || 0
      };

      const response = await tourGuideSchedulesAPI.create(scheduleData);
      if (response.status === 'success') {
        await fetchSchedules();
        setShowAddModal(false);
        clearForm();
      }
    } catch (error) {
      console.error('Failed to add schedule:', error);
      alert('Failed to add schedule: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (window.confirm(isArabic ? 'هل أنت متأكد من حذف هذا الجدول؟' : 'Are you sure you want to delete this schedule?')) {
      try {
        await tourGuideSchedulesAPI.delete(id);
        await fetchSchedules();
      } catch (error) {
        console.error('Failed to delete schedule:', error);
        alert('Failed to delete schedule: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=1200,height=800');
    const dateStr = new Date(selectedDate).toLocaleDateString();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Tour Guide Schedule - ${dateStr}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            direction: ${isArabic ? 'rtl' : 'ltr'};
          }
          h1 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
          }
          .date-info {
            text-align: center;
            margin-bottom: 20px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th {
            background-color: #2196f3;
            color: white;
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
          }
          td {
            padding: 8px;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          @media print {
            body { margin: 0; }
            @page { margin: 1cm; }
          }
        </style>
      </head>
      <body>
        <h1>${isArabic ? 'جدول مرشد سياحي' : 'Tour Guide Schedule'}</h1>
        <div class="date-info">
          <strong>${isArabic ? 'التاريخ:' : 'Date:'}</strong> ${dateStr}
        </div>
        <table>
          <thead>
            <tr>
              <th>${isArabic ? 'اسم المرشد' : 'Guide Name'}</th>
              <th>${isArabic ? 'اسم العميل' : 'Client Name'}</th>
              <th>${isArabic ? 'رقم الملف' : 'File Number'}</th>
              <th>${isArabic ? 'الموقع' : 'Location'}</th>
              <th>${isArabic ? 'وقت البداية' : 'Start Time'}</th>
              <th>${isArabic ? 'وقت النهاية' : 'End Time'}</th>
              <th>${isArabic ? 'عدد المسافرين' : 'Pax'}</th>
              <th>${isArabic ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            ${schedules.map((schedule, index) => `
              <tr>
                <td>${schedule.guideName || '-'}</td>
                <td>${schedule.clientName || '-'}</td>
                <td>${schedule.fileNumber || '-'}</td>
                <td>${schedule.location || '-'}</td>
                <td>${schedule.startTime || '00:00'}</td>
                <td>${schedule.endTime || '00:00'}</td>
                <td>${schedule.pax || 0}</td>
                <td>${schedule.status || 'Pending'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  const downloadExcel = () => {
    const headers = ['Guide Name', 'Client Name', 'File Number', 'Location', 'Start Time', 'End Time', 'Pax', 'Status', 'Notes'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n"
      + schedules.map(schedule => 
          `${schedule.guideName || ''},${schedule.clientName || ''},${schedule.fileNumber || ''},${schedule.location || ''},${schedule.startTime || '00:00'},${schedule.endTime || '00:00'},${schedule.pax || 0},${schedule.status || 'Pending'},"${schedule.notes || ''}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tour-guide-schedule-${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="tour-guide-schedule-page"><div className="loading-message">Loading schedules...</div></div>;
  }

  return (
    <div className="tour-guide-schedule-page">
      <div className="schedule-header">
        <h1>{isArabic ? 'جدول مرشد سياحي' : 'Tour Guide Schedule'}</h1>
      </div>

      <div className="schedule-actions">
        <button className="print-btn" onClick={handlePrint}>
          <span className="btn-icon">🖨️</span>
          {isArabic ? 'طباعة' : 'Print'}
        </button>
        <button className="export-excel-btn" onClick={downloadExcel}>
          <span className="btn-icon">📊</span>
          {isArabic ? 'تصدير Excel' : 'Export Excel'}
        </button>
      </div>

      <div className="schedule-content">
        <div className="date-filter-container">
          <label>{isArabic ? 'التاريخ' : 'Date'}</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
          <button className="add-btn-green" onClick={() => setShowAddModal(true)}>
            <span className="btn-icon">➕</span>
            {isArabic ? 'إضافة' : 'Add'}
          </button>
        </div>

        <div className="schedule-table-container">
          {schedules.length === 0 ? (
            <div className="no-schedules">
              {isArabic ? 'لا توجد جداول لهذا التاريخ' : 'No schedules for this date'}
            </div>
          ) : (
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>{isArabic ? 'اسم المرشد' : 'Guide Name'}</th>
                  <th>{isArabic ? 'اسم العميل' : 'Client Name'}</th>
                  <th>{isArabic ? 'رقم الملف' : 'File Number'}</th>
                  <th>{isArabic ? 'الموقع' : 'Location'}</th>
                  <th>{isArabic ? 'وقت البداية' : 'Start Time'}</th>
                  <th>{isArabic ? 'وقت النهاية' : 'End Time'}</th>
                  <th>{isArabic ? 'عدد المسافرين' : 'Pax'}</th>
                  <th>{isArabic ? 'الحالة' : 'Status'}</th>
                  <th>{isArabic ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule._id}>
                    <td>{schedule.guideName}</td>
                    <td>{schedule.clientName || '-'}</td>
                    <td>{schedule.fileNumber || '-'}</td>
                    <td>{schedule.location || '-'}</td>
                    <td>{schedule.startTime || '00:00'}</td>
                    <td>{schedule.endTime || '00:00'}</td>
                    <td>{schedule.pax || 0}</td>
                    <td>
                      <span className={`status-badge status-${schedule.status?.toLowerCase()}`}>
                        {schedule.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteSchedule(schedule._id)}
                        title={isArabic ? 'حذف' : 'Delete'}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); clearForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isArabic ? 'إضافة جدول مرشد' : 'Add Tour Guide Schedule'}</h2>
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
                  <label>{isArabic ? 'اسم المرشد' : 'Guide Name'} <span className="required">*</span></label>
                  <input 
                    type="text" 
                    value={formData.guideName}
                    onChange={(e) => handleFormChange('guideName', e.target.value)}
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
                  <label>{isArabic ? 'رقم الملف' : 'File Number'}</label>
                  <input 
                    type="text" 
                    value={formData.fileNumber}
                    onChange={(e) => handleFormChange('fileNumber', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>{isArabic ? 'الموقع' : 'Location'}</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>{isArabic ? 'وقت البداية' : 'Start Time'}</label>
                  <input 
                    type="time" 
                    value={formData.startTime}
                    onChange={(e) => handleFormChange('startTime', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>{isArabic ? 'وقت النهاية' : 'End Time'}</label>
                  <input 
                    type="time" 
                    value={formData.endTime}
                    onChange={(e) => handleFormChange('endTime', e.target.value)}
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
                  <label>{isArabic ? 'الحالة' : 'Status'}</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-field full-width">
                  <label>{isArabic ? 'تفاصيل الجولة' : 'Tour Details'}</label>
                  <textarea 
                    value={formData.tourDetails}
                    onChange={(e) => handleFormChange('tourDetails', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="form-field full-width">
                  <label>{isArabic ? 'ملاحظات' : 'Notes'}</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                    rows="2"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="clear-btn" onClick={clearForm}>
                {isArabic ? 'مسح' : 'Clear'}
              </button>
              <button className="save-btn" onClick={handleAddSchedule}>
                {isArabic ? 'إضافة' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourGuideSchedulePage;

