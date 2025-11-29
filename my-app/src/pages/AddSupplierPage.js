import React, { useState } from 'react';
import '../styles/AddSupplierPage.css';

const AddSupplierPage = ({ isArabic, onAddSupplier }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    // Supplier Info
    supplierName: '',
    country: '',
    city: '',
    supplierType: [],
    currency: '',
    branch: '',
    mc: '',
    stateRegion: '',
    address1: '',
    zipCode: '',
    fax: '',
    licenseNumber: '',
    ownerName: '',
    supplierTypeLedger: '',
    missions: '',
    supplierPaymentType: '',
    taxPayerName: '',
    
    // Supplier Contact
    supplierCode: '',
    accountingCode: '',
    taxNumber: '',
    address2: '',
    telephone: '',
    email: '',
    cardNumber: '',
    url: '',
    logoUpload: null,
    ref: '',
    remarkForInvoice: '',
    tax: '',
    discountCollection: '',
    isCustomer: false
  });

  // Translations
  const t = isArabic ? {
    supplierInfo: 'معلومات المورد',
    supplierContact: 'جهة اتصال المورد',
    supplierName: 'اسم المورد',
    country: 'الدولة',
    city: 'المدينة',
    supplierType: 'نوع المورد',
    currency: 'العملة',
    branch: 'الفرع',
    mc: 'MC',
    stateRegion: 'الولاية/المنطقة',
    address1: 'العنوان 1',
    zipCode: 'الرمز البريدي',
    fax: 'فاكس',
    licenseNumber: 'رقم الترخيص',
    ownerName: 'اسم المالك',
    missions: 'المهام',
    taxPayerName: 'اسم دافع الضرائب',
    supplierCode: 'كود المورد',
    accountingCode: 'كود المحاسبة',
    taxNumber: 'الرقم الضريبي',
    address2: 'العنوان 2',
    telephone: 'الهاتف',
    email: 'البريد الإلكتروني',
    cardNumber: 'رقم البطاقة',
    url: 'الموقع',
    logoUpload: 'رفع الشعار',
    ref: 'المرجع',
    remarkForInvoice: 'ملاحظة للفاتورة',
    tax: 'الضريبة',
    discountCollection: 'الخصم والتحصيل',
    isCustomer: 'هل هو عميل',
    clear: 'مسح',
    addSupplier: 'إضافة مورد',
    selectCode: 'اختر الكود',
    selectCountry: 'اختر الدولة',
    selectCity: 'اختر المدينة',
    selectLedger: 'اختر دفتر الأستاذ',
    selectMission: 'اختر المهمة',
    selectPaymentType: 'اختر نوع الدفع',
    selectMCFrom0To9: 'اختر MC من 0 إلى 9',
    enterText: 'أدخل النص',
    browse: 'تصفح',
    chooseLogo: 'اختر الشعار',
    hotel: 'فندق',
    transportation: 'نقل',
    airTransport: 'نقل جوي',
    visa: 'تأشيرة'
  } : {
    supplierInfo: 'Supplier Info',
    supplierContact: 'Supplier Contact',
    supplierName: 'Supplier Name',
    country: 'Country',
    city: 'City',
    supplierType: 'Supplier Type',
    currency: 'Currency',
    branch: 'Branch',
    mc: 'MC',
    stateRegion: 'State/Region',
    address1: 'Address 1',
    zipCode: 'Zip Code',
    fax: 'Fax',
    licenseNumber: 'Licence Number',
    ownerName: 'Owner Name',
    missions: 'Missions',
    taxPayerName: 'Tax Payer Name',
    supplierCode: 'Supplier Code',
    accountingCode: 'Accounting Code',
    taxNumber: 'Tax Number',
    address2: 'Address 2',
    telephone: 'Telephone',
    email: 'Email',
    cardNumber: 'Card Number',
    url: 'Url',
    logoUpload: 'Logo Upload',
    ref: 'Ref',
    remarkForInvoice: 'Remark For Invoice',
    tax: 'Tax',
    discountCollection: 'Discount & Collection',
    isCustomer: 'Is Customer',
    clear: 'Clear',
    addSupplier: 'Add Supplier',
    selectCode: 'Select Code',
    selectCountry: 'Country',
    selectCity: 'City',
    selectLedger: 'Select Ledger',
    selectMission: 'Mission',
    selectPaymentType: 'supplier payment type',
    selectMCFrom0To9: 'Select MC From 0 To 9',
    enterText: 'Enter Text',
    browse: 'Browse',
    chooseLogo: 'Choose Logo',
    hotel: 'Hotel',
    transportation: 'Transportation',
    airTransport: 'Air Transport',
    visa: 'Visa'
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSupplierTypeChange = (type) => {
    const currentTypes = [...formData.supplierType];
    const index = currentTypes.indexOf(type);
    
    if (index > -1) {
      currentTypes.splice(index, 1);
    } else {
      currentTypes.push(type);
    }
    
    setFormData({
      ...formData,
      supplierType: currentTypes
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        logoUpload: file
      });
    }
  };

  const clearForm = () => {
    setFormData({
      supplierName: '',
      country: '',
      city: '',
      supplierType: [],
      currency: '',
      branch: '',
      mc: '',
      stateRegion: '',
      address1: '',
      zipCode: '',
      fax: '',
      licenseNumber: '',
      ownerName: '',
      supplierTypeLedger: '',
      missions: '',
      supplierPaymentType: '',
      taxPayerName: '',
      supplierCode: '',
      accountingCode: '',
      taxNumber: '',
      address2: '',
      telephone: '',
      email: '',
      cardNumber: '',
      url: '',
      logoUpload: null,
      ref: '',
      remarkForInvoice: '',
      tax: '',
      discountCollection: '',
      isCustomer: false
    });
  };

  const handleSubmit = () => {
    console.log('Supplier data:', formData);
    
    const newSupplier = {
      id: Date.now(),
      name: formData.supplierName,
      email: formData.email || '-',
      phone: formData.telephone || '-',
      country: formData.country || '-',
      city: formData.city || '-',
      branch: formData.branch || '-',
      supplierCode: formData.supplierCode || Math.floor(10000000 + Math.random() * 90000000).toString(),
      code: formData.accountingCode || '-',
      taxNumber: formData.taxNumber || '-',
      mc: formData.mc || '-',
      status: 'enabled',
      createdBy: 'Current User',
      createdAt: new Date().toLocaleString()
    };

    if (onAddSupplier) {
      onAddSupplier(newSupplier);
    }

    alert('Supplier added successfully!');
    clearForm();
  };

  return (
    <div className="add-supplier-page">
      {/* Tabs */}
      <div className="supplier-tabs">
        <button 
          className={`supplier-tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          {t.supplierInfo}
        </button>
        <button 
          className={`supplier-tab ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          {t.supplierContact}
        </button>
      </div>

      {/* Supplier Info Tab */}
      {activeTab === 'info' && (
        <div className="supplier-form-container">
          <h2 className="form-section-title">{t.supplierInfo}</h2>
          
          <div className="supplier-form-grid">
            {/* Left Column */}
            <div className="form-column">
              {/* Supplier Name */}
              <div className="form-field">
                <label className="form-label">
                  {t.supplierName} <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.supplierName}
                  onChange={(e) => handleInputChange('supplierName', e.target.value)}
                />
              </div>

              {/* Country */}
              <div className="form-field">
                <label className="form-label">{t.country}</label>
                <select
                  className="form-select"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                >
                  <option value="">{t.selectCountry}</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="UAE">UAE</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kuwait">Kuwait</option>
                </select>
              </div>

              {/* City */}
              <div className="form-field">
                <label className="form-label">{t.city}</label>
                <select
                  className="form-select"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                >
                  <option value="">{t.selectCity}</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Luxor">Luxor</option>
                  <option value="Aswan">Aswan</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Mecca">Mecca</option>
                  <option value="Medina">Medina</option>
                </select>
              </div>

              {/* Supplier Type (Multi-select) */}
              <div className="form-field">
                <label className="form-label">{t.supplierType}</label>
                <div className="multi-select-box">
                  <div 
                    className={`multi-select-item ${formData.supplierType.includes('Hotel') ? 'selected' : ''}`}
                    onClick={() => handleSupplierTypeChange('Hotel')}
                  >
                    {t.hotel}
                  </div>
                  <div 
                    className={`multi-select-item ${formData.supplierType.includes('Transportation') ? 'selected' : ''}`}
                    onClick={() => handleSupplierTypeChange('Transportation')}
                  >
                    {t.transportation}
                  </div>
                  <div 
                    className={`multi-select-item ${formData.supplierType.includes('Air Transport') ? 'selected' : ''}`}
                    onClick={() => handleSupplierTypeChange('Air Transport')}
                  >
                    {t.airTransport}
                  </div>
                  <div 
                    className={`multi-select-item ${formData.supplierType.includes('Visa') ? 'selected' : ''}`}
                    onClick={() => handleSupplierTypeChange('Visa')}
                  >
                    {t.visa}
                  </div>
                </div>
              </div>

              {/* Currency */}
              <div className="form-field">
                <label className="form-label">{t.currency}</label>
                <select
                  className="form-select"
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                >
                  <option value="">Select Currency</option>
                  <option value="EGP">EGP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="SAR">SAR</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                </select>
              </div>

              {/* Branch */}
              <div className="form-field">
                <label className="form-label">
                  {t.branch} <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.branch}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                >
                  <option value="">Select Branch</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Luxor">Luxor</option>
                  <option value="Aswan">Aswan</option>
                </select>
              </div>

              {/* MC */}
              <div className="form-field">
                <label className="form-label">{t.mc}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t.selectMCFrom0To9}
                  value={formData.mc}
                  onChange={(e) => handleInputChange('mc', e.target.value)}
                />
              </div>

              {/* State/Region */}
              <div className="form-field">
                <label className="form-label">{t.stateRegion}</label>
                <select
                  className="form-select"
                  value={formData.stateRegion}
                  onChange={(e) => handleInputChange('stateRegion', e.target.value)}
                >
                  <option value="">Select State/Region</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Giza">Giza</option>
                  <option value="Alexandria">Alexandria</option>
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div className="form-column">
              {/* Address 1 */}
              <div className="form-field">
                <label className="form-label">{t.address1}</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={formData.address1}
                  onChange={(e) => handleInputChange('address1', e.target.value)}
                />
              </div>

              {/* Zip Code */}
              <div className="form-field">
                <label className="form-label">{t.zipCode}</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </div>

              {/* Fax */}
              <div className="form-field">
                <label className="form-label">{t.fax}</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.fax}
                  onChange={(e) => handleInputChange('fax', e.target.value)}
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="form-column">
              {/* License Number */}
              <div className="form-field">
                <label className="form-label">{t.licenseNumber}</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                />
              </div>

              {/* Owner Name */}
              <div className="form-field">
                <label className="form-label">{t.ownerName}</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                />
              </div>

              {/* Supplier Type (Ledger) */}
              <div className="form-field">
                <label className="form-label">{t.supplierType}</label>
                <select
                  className="form-select"
                  value={formData.supplierTypeLedger}
                  onChange={(e) => handleInputChange('supplierTypeLedger', e.target.value)}
                >
                  <option value="">{t.selectLedger}</option>
                  <option value="Type1">Type 1</option>
                  <option value="Type2">Type 2</option>
                </select>
              </div>

              {/* Missions */}
              <div className="form-field">
                <label className="form-label">{t.missions}</label>
                <select
                  className="form-select"
                  value={formData.missions}
                  onChange={(e) => handleInputChange('missions', e.target.value)}
                >
                  <option value="">{t.selectMission}</option>
                  <option value="Mission1">Mission 1</option>
                  <option value="Mission2">Mission 2</option>
                </select>
              </div>
            </div>

            {/* Column 4 */}
            <div className="form-column">
              {/* Supplier Payment Type */}
              <div className="form-field">
                <label className="form-label">Supplier Payment Type</label>
                <select
                  className="form-select"
                  value={formData.supplierPaymentType}
                  onChange={(e) => handleInputChange('supplierPaymentType', e.target.value)}
                >
                  <option value="">{t.selectPaymentType}</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              {/* Tax Payer Name */}
              <div className="form-field">
                <label className="form-label">{t.taxPayerName}</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.taxPayerName}
                  onChange={(e) => handleInputChange('taxPayerName', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Contact Tab */}
      {activeTab === 'contact' && (
        <div className="supplier-form-container">
          <h2 className="form-section-title">{t.supplierContact}</h2>
          
          <div className="supplier-form-grid-two-column">
            {/* Left Column */}
            <div className="form-column">
              {/* Supplier Code */}
              <div className="form-field">
                <label className="form-label">{t.supplierCode}</label>
                <select
                  className="form-select"
                  value={formData.supplierCode}
                  onChange={(e) => handleInputChange('supplierCode', e.target.value)}
                >
                  <option value="">{t.selectCode}</option>
                  <option value="auto">Auto Generate</option>
                </select>
              </div>

              {/* Accounting Code */}
              <div className="form-field">
                <label className="form-label">{t.accountingCode}</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.accountingCode}
                  onChange={(e) => handleInputChange('accountingCode', e.target.value)}
                />
              </div>

              {/* Tax Number */}
              <div className="form-field">
                <label className="form-label">{t.taxNumber}</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.taxNumber}
                  onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                />
              </div>

              {/* Address 2 */}
              <div className="form-field">
                <label className="form-label">{t.address2}</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={formData.address2}
                  onChange={(e) => handleInputChange('address2', e.target.value)}
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="form-column">
              {/* Telephone */}
              <div className="form-field">
                <label className="form-label">{t.telephone}</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="form-field">
                <label className="form-label">{t.email}</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              {/* Card Number */}
              <div className="form-field">
                <label className="form-label">{t.cardNumber}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="form-column">
              {/* URL */}
              <div className="form-field">
                <label className="form-label">{t.url}</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                />
              </div>

              {/* Logo Upload */}
              <div className="form-field">
                <label className="form-label">{t.logoUpload}</label>
                <div className="file-upload-wrapper">
                  <input
                    type="text"
                    className="form-input file-input-display"
                    placeholder={t.chooseLogo}
                    value={formData.logoUpload?.name || ''}
                    readOnly
                  />
                  <button 
                    className="browse-btn"
                    onClick={() => document.getElementById('logoInput').click()}
                  >
                    {t.browse}
                  </button>
                  <input
                    id="logoInput"
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Ref */}
              <div className="form-field">
                <label className="form-label">{t.ref}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ref"
                  value={formData.ref}
                  onChange={(e) => handleInputChange('ref', e.target.value)}
                />
              </div>
            </div>

            {/* Column 4 */}
            <div className="form-column">
              {/* Remark For Invoice */}
              <div className="form-field">
                <label className="form-label">{t.remarkForInvoice}</label>
                <div className="rich-text-toolbar">
                  <button type="button" className="toolbar-btn" title="Bold"><strong>B</strong></button>
                  <button type="button" className="toolbar-btn" title="Italic"><em>I</em></button>
                  <button type="button" className="toolbar-btn" title="Underline"><u>U</u></button>
                  <button type="button" className="toolbar-btn" title="Strike">S</button>
                  <button type="button" className="toolbar-btn" title="Quote">""</button>
                  <button type="button" className="toolbar-btn" title="Code">&lt;/&gt;</button>
                  <button type="button" className="toolbar-btn" title="H1">H₁</button>
                  <button type="button" className="toolbar-btn" title="H2">H₂</button>
                </div>
                <textarea
                  className="form-textarea rich-textarea"
                  rows="5"
                  placeholder={t.enterText}
                  value={formData.remarkForInvoice}
                  onChange={(e) => handleInputChange('remarkForInvoice', e.target.value)}
                />
              </div>

              {/* Tax */}
              <div className="form-field">
                <label className="form-label">{t.tax}</label>
                <select
                  className="form-select"
                  value={formData.tax}
                  onChange={(e) => handleInputChange('tax', e.target.value)}
                >
                  <option value="">Select Tax</option>
                  <option value="0%">0%</option>
                  <option value="5%">5%</option>
                  <option value="14%">14%</option>
                  <option value="15%">15%</option>
                </select>
              </div>

              {/* Discount & Collection */}
              <div className="form-field">
                <label className="form-label">{t.discountCollection}</label>
                <select
                  className="form-select"
                  value={formData.discountCollection}
                  onChange={(e) => handleInputChange('discountCollection', e.target.value)}
                >
                  <option value="">Select Discount & Collection</option>
                  <option value="discount">Discount</option>
                  <option value="collection">Collection</option>
                </select>
              </div>

              {/* Is Customer */}
              <div className="form-field checkbox-field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={formData.isCustomer}
                    onChange={(e) => handleInputChange('isCustomer', e.target.checked)}
                  />
                  <span>{t.isCustomer}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Buttons */}
      <div className="supplier-form-footer">
        <button className="clear-btn" onClick={clearForm}>
          {t.clear}
        </button>
        <button className="add-supplier-btn" onClick={handleSubmit}>
          {t.addSupplier}
        </button>
      </div>
    </div>
  );
};

export default AddSupplierPage;

