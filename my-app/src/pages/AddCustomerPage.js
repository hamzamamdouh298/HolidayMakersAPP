import React, { useState } from 'react';
import '../styles/AddCustomerPage.css';
import { customersAPI } from '../services/api';

const AddCustomerPage = ({ t, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerType: '',
    customerCode: '',
    creditTerm: '',
    branch: '',
    country: '',
    city: '',
    regionCity: '',
    buildingNumber: '',
    address1: '',
    address2: '',
    zipCode: '',
    refNote: '',
    fax: '',
    licenseNumber: '',
    ownerName: '',
    staffOwner: '',
    accountManager: '',
    accountingCode: '',
    galileoCode: '',
    telephone: {
      countryCode: '+971',
      number: ''
    },
    additionalPhone: {
      countryCode: '+971',
      number: ''
    },
    email: '',
    nationalId: '',
    passportNumber: '',
    andOfficeIds: '',
    costPlus: '',
    customerCommission: '',
    url: '',
    taxNumber: '',
    title: '',
    nationality: '',
    remarkForInvoice: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (field, type, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: value
      }
    }));
  };

  const handleClear = () => {
    setFormData({
      customerName: '',
      customerType: '',
      customerCode: '',
      creditTerm: '',
      branch: '',
      country: '',
      city: '',
      regionCity: '',
      buildingNumber: '',
      address1: '',
      address2: '',
      zipCode: '',
      refNote: '',
      fax: '',
      licenseNumber: '',
      ownerName: '',
      staffOwner: '',
      accountManager: '',
      accountingCode: '',
      galileoCode: '',
      telephone: {
        countryCode: '+971',
        number: ''
      },
      additionalPhone: {
        countryCode: '+971',
        number: ''
      },
      email: '',
      nationalId: '',
      passportNumber: '',
      andOfficeIds: '',
      costPlus: '',
      customerCommission: '',
      url: '',
      taxNumber: '',
      title: '',
      nationality: '',
      remarkForInvoice: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.customerName.trim()) {
      setError('Customer Name is required');
      return;
    }

    if (!formData.customerType) {
      setError('Customer Type is required');
      return;
    }

    setLoading(true);

    try {
      const response = await customersAPI.create(formData);
      
      if (response.success) {
        setSuccess('Customer added successfully!');
        handleClear();
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-customer-page">
      <div className="add-customer-header">
        <h2>Customer Info</h2>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="customer-form">
        <div className="form-section">
          <h3 className="section-title">Customer Info</h3>
          
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-group">
                <label>Customer Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Customer Type <span className="required">*</span></label>
                <select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Ledger</option>
                  <option value="Individual">Individual</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Agency">Agency</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Credit Term</label>
                <input
                  type="number"
                  name="creditTerm"
                  value={formData.creditTerm}
                  onChange={handleChange}
                  placeholder="Days"
                />
              </div>

              <div className="form-group">
                <label>Branch <span className="required">*</span></label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                >
                  <option value="">Select Branch</option>
                  <option value="Main">Main Branch</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                </select>
              </div>

              <div className="form-group">
                <label>Country <span className="required">*</span></label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Country</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Lebanon">Lebanon</option>
                </select>
              </div>

              <div className="form-group">
                <label>City <span className="required">*</span></label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                >
                  <option value="">City</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                </select>
              </div>

              <div className="form-group">
                <label>Region City</label>
                <input
                  type="text"
                  name="regionCity"
                  value={formData.regionCity}
                  onChange={handleChange}
                  placeholder="Region/Area"
                />
              </div>

              <div className="form-group">
                <label>Building Number</label>
                <input
                  type="text"
                  name="buildingNumber"
                  value={formData.buildingNumber}
                  onChange={handleChange}
                  placeholder="Building number"
                />
              </div>

              <div className="form-group">
                <label>Address 1</label>
                <textarea
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  placeholder="Street address, P.O. box"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                />
              </div>

              <div className="form-group">
                <label>Ref Note</label>
                <input
                  type="text"
                  name="refNote"
                  value={formData.refNote}
                  onChange={handleChange}
                  placeholder="Reference note"
                />
              </div>

              <div className="form-group">
                <label>Fax</label>
                <input
                  type="text"
                  name="fax"
                  value={formData.fax}
                  onChange={handleChange}
                  placeholder="Fax number"
                />
              </div>

              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Business license number"
                />
              </div>

              <div className="form-group">
                <label>Owner Name</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Owner name"
                />
              </div>

              <div className="form-group">
                <label>Staff Owner</label>
                <input
                  type="text"
                  name="staffOwner"
                  value={formData.staffOwner}
                  onChange={handleChange}
                  placeholder="Staff owner"
                />
              </div>

              <div className="form-group">
                <label>Account Manager</label>
                <select
                  name="accountManager"
                  value={formData.accountManager}
                  onChange={handleChange}
                >
                  <option value="">Open this select menu</option>
                  <option value="Nada">Nada</option>
                  <option value="Ali">Ali</option>
                  <option value="محمود كمال محمد">محمود كمال محمد</option>
                  <option value="shaher">shaher</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-group">
                <label>Customer Code</label>
                <select
                  name="customerCode"
                  value={formData.customerCode}
                  onChange={handleChange}
                >
                  <option value="">Select Ledger</option>
                  <option value="auto">Auto Generate</option>
                </select>
                <small className="form-hint">Leave empty to auto-generate</small>
              </div>

              <div className="form-group">
                <label>Accounting Code</label>
                <input
                  type="text"
                  name="accountingCode"
                  value={formData.accountingCode}
                  onChange={handleChange}
                  placeholder="Accounting code"
                />
              </div>

              <div className="form-group">
                <label>Galileo Code</label>
                <input
                  type="text"
                  name="galileoCode"
                  value={formData.galileoCode}
                  onChange={handleChange}
                  placeholder="Galileo code"
                />
              </div>

              <div className="form-group">
                <label>Address 2</label>
                <textarea
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit, etc."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Telephone <span className="required">*</span></label>
                <div className="phone-input">
                  <select
                    className="country-code"
                    value={formData.telephone.countryCode}
                    onChange={(e) => handlePhoneChange('telephone', 'countryCode', e.target.value)}
                  >
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+20">🇪🇬 +20</option>
                    <option value="+962">🇯🇴 +962</option>
                  </select>
                  <input
                    type="tel"
                    value={formData.telephone.number}
                    onChange={(e) => handlePhoneChange('telephone', 'number', e.target.value)}
                    placeholder="0100 123 4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Additional Phone</label>
                <div className="phone-input">
                  <select
                    className="country-code"
                    value={formData.additionalPhone.countryCode}
                    onChange={(e) => handlePhoneChange('additionalPhone', 'countryCode', e.target.value)}
                  >
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+20">🇪🇬 +20</option>
                    <option value="+962">🇯🇴 +962</option>
                  </select>
                  <input
                    type="tel"
                    value={formData.additionalPhone.number}
                    onChange={(e) => handlePhoneChange('additionalPhone', 'number', e.target.value)}
                    placeholder="0100 123 4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                />
              </div>

              <div className="form-group">
                <label>National ID <span className="required">*</span></label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="National ID"
                />
              </div>

              <div className="form-group">
                <label>Passport Number <span className="required">*</span></label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  placeholder="Passport Number"
                />
              </div>

              <div className="form-group">
                <label>And Office IDs</label>
                <select
                  name="andOfficeIds"
                  value={formData.andOfficeIds}
                  onChange={handleChange}
                >
                  <option value="">Amd Office IDs</option>
                  <option value="Office1">Office 1</option>
                  <option value="Office2">Office 2</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cost Plus</label>
                <input
                  type="number"
                  step="0.01"
                  name="costPlus"
                  value={formData.costPlus}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Customer Commission</label>
                <input
                  type="number"
                  step="0.01"
                  name="customerCommission"
                  value={formData.customerCommission}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Url</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>Tax Number</label>
                <input
                  type="text"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleChange}
                  placeholder="Tax number"
                />
              </div>

              <div className="form-group">
                <label>Title</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                >
                  <option value="">Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nationality</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                >
                  <option value="">Nationality</option>
                  <option value="UAE">Emirati</option>
                  <option value="Saudi">Saudi</option>
                  <option value="Egyptian">Egyptian</option>
                  <option value="Jordanian">Jordanian</option>
                  <option value="Lebanese">Lebanese</option>
                </select>
              </div>

              <div className="form-group form-group-full">
                <label>Remark For Invoice</label>
                <textarea
                  name="remarkForInvoice"
                  value={formData.remarkForInvoice}
                  onChange={handleChange}
                  placeholder="Enter Text"
                  rows="4"
                  className="rich-text-area"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Customer'}
          </button>
          <button
            type="button"
            className="btn btn-warning"
            disabled={loading}
          >
            Attachments
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomerPage;

