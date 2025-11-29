import React, { useState, useEffect } from 'react';
import { customersAPI } from '../services/api';

function NewReservationPage({ isArabic, onSaveReservation }) {
  const [hideVat, setHideVat] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [formData, setFormData] = useState({
    chooseType: '',
    relatedAccount: '',
    customerId: '',
    salesOfficer: '',
    currency: 'EGP',
    followUp: '',
    branch: '',
    dateOfInvoice: new Date().toISOString().split('T')[0],
    invoiceNo: '',
    notesOfInvoice: ''
  });

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      if (response.success) {
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  // Translations
  const t = isArabic ? {
    newReservation: 'حجز جديد',
    chooseType: 'اختر النوع',
    selectLedger: 'اختر دفتر الأستاذ',
    relatedAccount: 'الحساب المرتبط',
    salesOfficer: 'مسؤول المبيعات',
    currency: 'العملة',
    followUp: 'المتابعة',
    selectStatus: 'اختر الحالة',
    branch: 'الفرع',
    dateOfInvoice: 'تاريخ الفاتورة',
    invoiceNo: 'رقم الفاتورة',
    hideVat: 'إخفاء ضريبة القيمة المضافة',
    notesOfInvoice: 'ملاحظات الفاتورة',
    clear: 'مسح',
    addFile: 'إضافة ملف',
    reservationAdded: 'تم إضافة الحجز بنجاح!'
  } : {
    newReservation: 'New Reservation',
    chooseType: 'Choose Type',
    selectLedger: 'Select Ledger',
    relatedAccount: 'Related Account',
    salesOfficer: 'Sales Officer',
    currency: 'Currency',
    followUp: 'Follow Up',
    selectStatus: 'Select Status',
    branch: 'Branch',
    dateOfInvoice: 'Date Of Invoice',
    invoiceNo: 'No. Invoice',
    hideVat: 'Hide Vat',
    notesOfInvoice: 'Notes Of Invoice',
    clear: 'Clear',
    addFile: 'Add file',
    reservationAdded: 'Reservation added successfully!'
  };

  const handleFormChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleCustomerSearch = (searchValue) => {
    setCustomerSearchTerm(searchValue);
    setShowCustomerDropdown(true);
    
    if (searchValue.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => {
        const search = searchValue.toLowerCase();
        return (
          customer.customerName?.toLowerCase().includes(search) ||
          customer.customerCode?.toLowerCase().includes(search) ||
          customer.email?.toLowerCase().includes(search) ||
          customer.telephone?.number?.includes(search)
        );
      });
      setFilteredCustomers(filtered);
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchTerm(customer.customerName);
    setShowCustomerDropdown(false);
    setFormData({
      ...formData,
      relatedAccount: customer.customerName,
      customerId: customer._id
    });
  };

  const clearForm = () => {
    setFormData({
      chooseType: '',
      relatedAccount: '',
      customerId: '',
      salesOfficer: '',
      currency: 'EGP',
      followUp: '',
      branch: '',
      dateOfInvoice: new Date().toISOString().split('T')[0],
      invoiceNo: '',
      notesOfInvoice: ''
    });
    setHideVat(true);
    setSelectedCustomer(null);
    setCustomerSearchTerm('');
    setFilteredCustomers(customers);
  };

  const handleAddReservation = () => {
    // Generate a new reservation
    const newReservation = {
      id: Date.now(),
      fileNumber: '30' + Math.floor(100000 + Math.random() * 900000),
      client: formData.relatedAccount || 'N/A',
      customerId: formData.customerId,
      phone: selectedCustomer?.telephone?.number 
        ? `${selectedCustomer.telephone.countryCode || ''} ${selectedCustomer.telephone.number}`
        : '-',
      date: formData.dateOfInvoice,
      followUp: formData.followUp || '-',
      amount: '-',
      user: 'Etolv',
      branch: formData.branch || '-',
      salesOfficer: formData.salesOfficer || '-',
      progress: 'Pending',
      confirmStatus: 'UnConfirmed',
      dateOfInvoice: formData.dateOfInvoice,
      invoiceNo: formData.invoiceNo || '-',
      manualInvoiceSerial: '-',
      manualInvoiceID: '-',
      manualInvoiceDate: '-',
      updatedBy: 'Etolv',
      updatedAt: new Date().toLocaleString(),
      type: formData.chooseType,
      destination: '-',
      currency: formData.currency,
      notes: formData.notesOfInvoice,
      hideVat: hideVat,
      customerEmail: selectedCustomer?.email || '-',
      customerCode: selectedCustomer?.customerCode || '-'
    };

    // Call parent function to save reservation
    if (onSaveReservation) {
      onSaveReservation(newReservation);
    }

    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-success';
    toast.textContent = `${t.reservationAdded} File #: ${newReservation.fileNumber}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('toast-show'), 10);
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);

    // Clear form after adding
    clearForm();
  };

  return (
    <div className="new-reservation-page">
      <div className="new-reservation-header">
        <h1 className="new-reservation-title">{t.newReservation}</h1>
      </div>

      <div className="new-reservation-form-container">
        <div className="new-reservation-form-grid">
          {/* Choose Type */}
          <div className="new-reservation-form-field">
            <label className="new-reservation-label">{t.chooseType}</label>
            <select 
              className="new-reservation-form-select"
              value={formData.chooseType}
              onChange={(e) => handleFormChange('chooseType', e.target.value)}
            >
              <option value="">{t.selectLedger}</option>
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
              <option value="government">Government</option>
              <option value="travel_agent">Travel Agent</option>
              <option value="tour_operator">Tour Operator</option>
            </select>
          </div>

          {/* Related Account - Customer Selection */}
          <div className="new-reservation-form-field">
            <label className="new-reservation-label">
              {t.relatedAccount} <span className="required">*</span>
            </label>
            <div className="customer-search-container">
              <input 
                type="text"
                className="new-reservation-form-input"
                placeholder={isArabic ? 'بحث عن عميل' : 'Search for customer'}
                value={customerSearchTerm}
                onChange={(e) => handleCustomerSearch(e.target.value)}
                onFocus={() => setShowCustomerDropdown(true)}
              />
              {showCustomerDropdown && (
                <div className="customer-dropdown">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.slice(0, 10).map(customer => (
                      <div 
                        key={customer._id}
                        className="customer-dropdown-item"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <div className="customer-dropdown-name">
                          {customer.customerName}
                          {customer.customerCode && (
                            <span className="customer-dropdown-code">
                              ({customer.customerCode})
                            </span>
                          )}
                        </div>
                        <div className="customer-dropdown-info">
                          {customer.email && <span>{customer.email}</span>}
                          {customer.telephone?.number && (
                            <span> | {customer.telephone.number}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="customer-dropdown-empty">
                      {isArabic ? 'لم يتم العثور على عملاء' : 'No customers found'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sales Officer */}
          <div className="new-reservation-form-field">
            <label className="new-reservation-label">
              {t.salesOfficer} <span className="required">*</span>
            </label>
            <select 
              className="new-reservation-form-select"
              value={formData.salesOfficer}
              onChange={(e) => handleFormChange('salesOfficer', e.target.value)}
            >
              <option value="">{t.salesOfficer}</option>
              <option value="officer1">Officer 1</option>
              <option value="officer2">Officer 2</option>
            </select>
          </div>

          {/* Currency */}
          <div className="new-reservation-form-field">
            <label className="new-reservation-label">
              {t.currency} <span className="required">*</span>
            </label>
            <select 
              className="new-reservation-form-select"
              value={formData.currency}
              onChange={(e) => handleFormChange('currency', e.target.value)}
            >
              <option value="EGP">EGP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="SAR">SAR</option>
            </select>
          </div>

          {/* Follow up */}
          <div className="new-reservation-form-field">
            <label className="new-reservation-label">{t.followUp}</label>
            <select 
              className="new-reservation-form-select"
              value={formData.followUp}
              onChange={(e) => handleFormChange('followUp', e.target.value)}
            >
              <option value="">{t.selectStatus}</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          {/* Branch */}
          <div className="new-reservation-form-field">
            <label className="new-reservation-label">
              {t.branch} <span className="required">*</span>
            </label>
            <select 
              className="new-reservation-form-select"
              value={formData.branch}
              onChange={(e) => handleFormChange('branch', e.target.value)}
            >
              <option value="">{isArabic ? 'الفرع' : 'Branch'}</option>
              <option value="Cairo">Cairo</option>
              <option value="Luxor">Luxor</option>
              <option value="Aswan">Aswan</option>
            </select>
          </div>

          {/* Date of invoice */}
          <div className="new-reservation-form-field">
            <label className="new-reservation-label">{t.dateOfInvoice}</label>
            <input 
              type="date" 
              className="new-reservation-form-input"
              value={formData.dateOfInvoice}
              onChange={(e) => handleFormChange('dateOfInvoice', e.target.value)}
            />
          </div>

          {/* Invoice No. */}
          <div className="new-reservation-form-field">
            <label className="new-reservation-label">{t.invoiceNo}</label>
            <input 
              type="text" 
              className="new-reservation-form-input"
              placeholder=""
              value={formData.invoiceNo}
              onChange={(e) => handleFormChange('invoiceNo', e.target.value)}
            />
          </div>

          {/* Hide Vat Checkbox */}
          <div className="new-reservation-form-field checkbox-inline">
            <label className="new-reservation-checkbox-label-inline">
              <input 
                type="checkbox" 
                className="new-reservation-checkbox"
                checked={hideVat}
                onChange={(e) => setHideVat(e.target.checked)}
              />
              <span className="checkbox-text">{t.hideVat}</span>
            </label>
          </div>
        </div>

        {/* Notes of invoice */}
        <div className="new-reservation-form-field-full">
          <label className="new-reservation-label">{t.notesOfInvoice}</label>
          <textarea 
            className="new-reservation-form-textarea"
            rows="3"
            value={formData.notesOfInvoice}
            onChange={(e) => handleFormChange('notesOfInvoice', e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="new-reservation-footer">
          <button className="new-reservation-clear-btn" onClick={clearForm}>
            {t.clear}
          </button>
          <button className="new-reservation-add-btn" onClick={handleAddReservation}>
            {t.addFile}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewReservationPage;

