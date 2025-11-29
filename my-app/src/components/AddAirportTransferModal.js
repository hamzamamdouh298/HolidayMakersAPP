import React, { useState, useEffect } from 'react';
import { airportTransfersAPI, usersAPI } from '../services/api';
import '../styles/AddAirportTransferModal.css';

const AddAirportTransferModal = ({ isOpen, onClose, onSuccess, transfer }) => {
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
        serialNumber: '',
        branch: '',
        entryId: 'UnConfirm',
        referenceId: ''
    });

    useEffect(() => {
        fetchAgents();

        // If editing, populate form with transfer data
        if (transfer) {
            setFormData({
                vehicle: transfer.vehicle || '',
                vehicleType: transfer.vehicleType || '',
                guestName: transfer.guestName || '',
                customerName: transfer.customerName || '',
                driverName: transfer.driverName || '',
                delegateName: transfer.delegateName || '',
                station: transfer.station || '',
                kmStart: transfer.kmStart || '',
                kmReturn: transfer.kmReturn || '',
                distance: transfer.distance || '',
                date: transfer.date ? transfer.date.split('T')[0] : '',
                pickupTime: transfer.pickupTime || '',
                startLocation: transfer.startLocation || '',
                endLocation: transfer.endLocation || '',
                orderTime: transfer.orderTime || '',
                orderDate: transfer.orderDate ? transfer.orderDate.split('T')[0] : '',
                flightNo: transfer.flightNo || '',
                delegatorCommission: transfer.delegatorCommission || '',
                commission: transfer.commission || '',
                currency: transfer.currency || 'EGP',
                salePrice: transfer.salePrice || '',
                paymentLocation: transfer.paymentLocation || '',
                agent: transfer.agent?._id || transfer.agent || '',
                receiverName: transfer.receiverName || '',
                serialNumber: transfer.serialNumber || '',
                branch: transfer.branch || '',
                entryId: transfer.entryId || 'UnConfirm',
                referenceId: transfer.referenceId || ''
            });
        }
    }, [transfer]);

    const fetchAgents = async () => {
        try {
            const response = await usersAPI.getAll();
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

        // Auto-calculate distance
        if (name === 'kmStart' || name === 'kmReturn') {
            const start = name === 'kmStart' ? parseFloat(value) : parseFloat(formData.kmStart);
            const returnKm = name === 'kmReturn' ? parseFloat(value) : parseFloat(formData.kmReturn);
            if (!isNaN(start) && !isNaN(returnKm)) {
                setFormData(prev => ({
                    ...prev,
                    distance: Math.abs(returnKm - start).toString()
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                ...formData,
                agent: formData.agent || null
            };

            let response;
            if (transfer) {
                // Update existing transfer
                response = await airportTransfersAPI.update(transfer._id, payload);
            } else {
                // Create new transfer
                response = await airportTransfersAPI.create(payload);
            }

            if (response.status === 'success') {
                setSuccess(transfer ? 'Airport Transfer updated successfully!' : 'Airport Transfer added successfully!');
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            }
        } catch (err) {
            setError(err.message || 'Failed to save airport transfer');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFormData({
            vehicle: '', vehicleType: '', guestName: '', customerName: '', driverName: '', delegateName: '', station: '', kmStart: '', kmReturn: '', distance: '',
            date: '', pickupTime: '', startLocation: '', endLocation: '', orderTime: '', orderDate: '', flightNo: '',
            delegatorCommission: '', commission: '', currency: 'EGP', salePrice: '', paymentLocation: '',
            agent: '', receiverName: '', serialNumber: '', branch: '', entryId: 'UnConfirm', referenceId: ''
        });
        setError('');
        setSuccess('');
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header">
                    <h2 className="modal-title">{transfer ? 'Edit Airport Transfer' : 'Add Airport Transfer'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit} id="airportTransferForm">
                        {/* SECTION 1: Vehicle Information */}
                        <div className="form-section">
                            <h3 className="section-title section-purple">
                                <span className="section-icon">🚗</span>
                                Vehicle Information
                            </h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Vehicle</label>
                                    <select name="vehicle" value={formData.vehicle} onChange={handleChange}>
                                        <option value="">Select Vehicle</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Van">Van</option>
                                        <option value="Bus">Bus</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Vehicle Type</label>
                                    <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                                        <option value="">Select Type</option>
                                        <option value="Standard">Standard</option>
                                        <option value="Luxury">Luxury</option>
                                        <option value="Executive">Executive</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Guest Name</label>
                                    <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Customer Name</label>
                                    <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Driver Name</label>
                                    <select name="driverName" value={formData.driverName} onChange={handleChange}>
                                        <option value="">Select Driver</option>
                                        <option value="Ahmed">Ahmed</option>
                                        <option value="Mohamed">Mohamed</option>
                                        <option value="Ibrahim">Ibrahim</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Delegate Name</label>
                                    <select name="delegateName" value={formData.delegateName} onChange={handleChange}>
                                        <option value="">Select Delegate</option>
                                        <option value="Delegate 1">Delegate 1</option>
                                        <option value="Delegate 2">Delegate 2</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Station <span className="required">*</span></label>
                                    <select name="station" value={formData.station} onChange={handleChange} required>
                                        <option value="">Select Station</option>
                                        <option value="Cairo Airport">Cairo Airport</option>
                                        <option value="Luxor Airport">Luxor Airport</option>
                                        <option value="Hurghada Airport">Hurghada Airport</option>
                                        <option value="Sharm El Sheikh Airport">Sharm El Sheikh Airport</option>
                                    </select>
                                </div>
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
                                    <input type="text" name="distance" value={formData.distance} disabled placeholder="Calculated" className="disabled-input" />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: Trip Details */}
                        <div className="form-section">
                            <h3 className="section-title section-red">
                                <span className="section-icon">📍</span>
                                Trip Details
                            </h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Date <span className="required">*</span></label>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} required placeholder="yyyy-mm-dd" />
                                </div>
                                <div className="form-group">
                                    <label>Pickup Time</label>
                                    <div className="input-with-icon">
                                        <input type="time" name="pickupTime" value={formData.pickupTime} onChange={handleChange} />
                                        <span className="input-icon">🕐</span>
                                    </div>
                                </div>
                                <div className="form-group form-group-wide">
                                    <label>Start Location</label>
                                    <input type="text" name="startLocation" value={formData.startLocation} onChange={handleChange} />
                                </div>
                                <div className="form-group form-group-wide">
                                    <label>End Location</label>
                                    <input type="text" name="endLocation" value={formData.endLocation} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Order Time</label>
                                    <div className="input-with-icon">
                                        <input type="time" name="orderTime" value={formData.orderTime} onChange={handleChange} />
                                        <span className="input-icon">🕐</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Order Date</label>
                                    <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} placeholder="yyyy-mm-dd" />
                                </div>
                                <div className="form-group">
                                    <label>Flight No.</label>
                                    <input type="text" name="flightNo" value={formData.flightNo} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: Financial Information */}
                        <div className="form-section">
                            <h3 className="section-title section-yellow">
                                <span className="section-icon">💰</span>
                                Financial Information
                            </h3>
                            <div className="form-grid form-grid-5">
                                <div className="form-group">
                                    <label>Delegator Commission</label>
                                    <input type="number" name="delegatorCommission" value={formData.delegatorCommission} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Commission</label>
                                    <input type="number" name="commission" value={formData.commission} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Currency <span className="required">*</span></label>
                                    <select name="currency" value={formData.currency} onChange={handleChange} required>
                                        <option value="EGP">جنيه مصري</option>
                                        <option value="USD">دولار أمريكي</option>
                                        <option value="EUR">يورو</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Sale Price <span className="required">*</span></label>
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
                            <h3 className="section-title section-blue">
                                <span className="section-icon">👤</span>
                                Customer Information
                            </h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Agent <span className="required">*</span></label>
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
                                    <label>Serial Number <span className="required">*</span></label>
                                    <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} required />
                                </div>
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
                                <div className="form-group">
                                    <label>Reference ID</label>
                                    <input type="text" name="referenceId" value={formData.referenceId} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                    <button type="button" className="btn-clear" onClick={handleClear}>
                        <span className="btn-icon">✕</span>
                        Clear
                    </button>
                    <button type="submit" form="airportTransferForm" className="btn-submit" disabled={loading}>
                        <span className="btn-icon">✈️</span>
                        {loading ? 'Saving...' : (transfer ? 'Update Airport Transfer' : 'Add Airport Transfer')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddAirportTransferModal;
