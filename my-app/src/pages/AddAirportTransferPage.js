import React, { useState, useEffect } from 'react';
import { airportTransfersAPI, usersAPI } from '../services/api';
import '../styles/AddHotelContractPage.css'; // Reusing existing styles for consistency

const AddAirportTransferPage = ({ t, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agents, setAgents] = useState([]);

  const [formData, setFormData] = useState({
    // Vehicle Information
    vehicle: '',
    vehicleType: '',
    guestName: '',
    customerName: '',
    driverName: '',
    delegateName: '',
    station: '',
    kmStart: '',
    kmReturn: '',
    distance: '',

    // Trip Details
    date: '',
    pickupTime: '',
    startLocation: '',
    endLocation: '',
    orderTime: '',
    orderDate: '',
    flightNo: '',

    // Financial Information
    delegatorCommission: '',
    commission: '',
    currency: 'EGP',
    salePrice: '',
    paymentLocation: '',

    // Customer Information
    agent: '',
    receiverName: '',
    arrivalDate: '',
    arrivalTime: '',
    serialNumber: '',
    referenceId: '',
    branch: '',
    entryId: 'UnConfirm',

    // Admin Notes
    adminNotes: ''
  });

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await usersAPI.getAll(); // Assuming agents are users
      if (response.status === 'success') {
        setAgents(response.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch agents', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (index, e) => {
    const { name, value } = e.target;
    const newPayments = [...payments];
    newPayments[index] = { ...newPayments[index], [name]: value };
    setPayments(newPayments);
  };

  const addPayment = () => {
    setPayments([...payments, { amount: '', date: '', method: '', notes: '' }]);
  };

  const removePayment = (index) => {
    const newPayments = payments.filter((_, i) => i !== index);
    setPayments(newPayments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        payments
      };

      const response = await airportTransfersAPI.create(payload);

      if (response.status === 'success') {
        setSuccess('Airport Transfer added successfully!');
        setFormData({
          vehicle: '', vehicleType: '', guestName: '', customerName: '', driverName: '', delegateName: '', station: '', kmStart: '', kmReturn: '', distance: '',
          date: '', pickupTime: '', startLocation: '', endLocation: '', orderTime: '', orderDate: '', flightNo: '',
          delegatorCommission: '', commission: '', currency: 'EGP', salePrice: '', paymentLocation: '',
          agent: '', receiverName: '', arrivalDate: '', arrivalTime: '', serialNumber: '', referenceId: '', branch: '', entryId: 'UnConfirm',
          adminNotes: ''
        });
        setPayments([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to add airport transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-contract-page">
      <div className="page-header">
        <h1 className="page-title">Add Airport Transfer</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="contract-form">
        {/* Vehicle Information */}
        <div className="form-section">
          <h2 className="section-title">🚗 Vehicle Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Vehicle *</label>
              <input type="text" name="vehicle" value={formData.vehicle} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Vehicle Type *</label>
              <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Guest Name</label>
              <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Customer Name</label>
              <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Driver Name</label>
              <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Delegate Name</label>
              <input type="text" name="delegateName" value={formData.delegateName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Station *</label>
              <input type="text" name="station" value={formData.station} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Km Start</label>
              <input type="number" name="kmStart" value={formData.kmStart} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Km Return</label>
              <input type="number" name="kmReturn" value={formData.kmReturn} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Distance</label>
              <input type="number" name="distance" value={formData.distance} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="form-section">
          <h2 className="section-title">📍 Trip Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Pickup Time</label>
              <input type="time" name="pickupTime" value={formData.pickupTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Start Location</label>
              <input type="text" name="startLocation" value={formData.startLocation} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>End Location</label>
              <input type="text" name="endLocation" value={formData.endLocation} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Order Time</label>
              <input type="time" name="orderTime" value={formData.orderTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Order Date</label>
              <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Flight No.</label>
              <input type="text" name="flightNo" value={formData.flightNo} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="form-section">
          <h2 className="section-title">💰 Financial Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Delegator Commission</label>
              <input type="number" name="delegatorCommission" value={formData.delegatorCommission} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Commission</label>
              <input type="number" name="commission" value={formData.commission} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Currency *</label>
              <select name="currency" value={formData.currency} onChange={handleChange} required>
                <option value="EGP">EGP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Sale Price *</label>
              <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Payment Location</label>
              <input type="text" name="paymentLocation" value={formData.paymentLocation} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="form-section">
          <h2 className="section-title">👤 Customer Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Agent *</label>
              <select name="agent" value={formData.agent} onChange={handleChange} required>
                <option value="">Select Agent</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>{agent.fullName || agent.username}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Receiver Name</label>
              <input type="text" name="receiverName" value={formData.receiverName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Arrival Date</label>
              <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Arrival Time</label>
              <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Serial Number *</label>
              <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Reference ID</label>
              <input type="text" name="referenceId" value={formData.referenceId} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Branch</label>
              <input type="text" name="branch" value={formData.branch} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Entry ID</label>
              <select name="entryId" value={formData.entryId} onChange={handleChange}>
                <option value="UnConfirm">UnConfirm</option>
                <option value="Confirm">Confirm</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="form-section">
          <div className="section-header-row">
            <h2 className="section-title">💸 Payments</h2>
            <button type="button" className="add-btn" onClick={addPayment}>+ Add Payment</button>
          </div>
          {payments.map((payment, index) => (
            <div key={index} className="payment-row">
              <div className="form-group">
                <label>Amount</label>
                <input type="number" name="amount" value={payment.amount} onChange={(e) => handlePaymentChange(index, e)} />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={payment.date} onChange={(e) => handlePaymentChange(index, e)} />
              </div>
              <div className="form-group">
                <label>Method</label>
                <input type="text" name="method" value={payment.method} onChange={(e) => handlePaymentChange(index, e)} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <input type="text" name="notes" value={payment.notes} onChange={(e) => handlePaymentChange(index, e)} />
              </div>
              <button type="button" className="delete-btn" onClick={() => removePayment(index)}>🗑️</button>
            </div>
          ))}
        </div>

        {/* Admin Notes */}
        <div className="form-section">
          <h2 className="section-title">Admin Notes</h2>
          <div className="form-group full-width">
            <textarea name="adminNotes" value={formData.adminNotes} onChange={handleChange} rows="4"></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Airport Transfer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAirportTransferPage;
