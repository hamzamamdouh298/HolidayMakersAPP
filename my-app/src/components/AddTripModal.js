import React, { useState, useEffect } from 'react';
import { tripsAPI } from '../services/api';
import '../styles/AddTripModal.css';

const AddTripModal = ({ isOpen, onClose, onSuccess, trip }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        tripName: '',
        tripStatus: 'Active',
        date: '',
        currency: 'EGP',
        available: 0,
        booked: 0,
        adults: 0,
        children: 0,
        infant: 0,
        file: '',
        type: 'Other'
    });

    useEffect(() => {
        if (trip) {
            setFormData({
                tripName: trip.tripName || '',
                tripStatus: trip.tripStatus || 'Active',
                date: trip.date ? trip.date.split('T')[0] : '',
                currency: trip.currency || 'EGP',
                available: trip.available || 0,
                booked: trip.booked || 0,
                adults: trip.adults || 0,
                children: trip.children || 0,
                infant: trip.infant || 0,
                file: trip.file || '',
                type: trip.type || 'Other'
            });
        } else {
            resetForm();
        }
    }, [trip, isOpen]);

    const resetForm = () => {
        setFormData({
            tripName: '',
            tripStatus: 'Active',
            date: '',
            currency: 'EGP',
            available: 0,
            booked: 0,
            adults: 0,
            children: 0,
            infant: 0,
            file: '',
            type: 'Other'
        });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numValue = ['available', 'booked', 'adults', 'children', 'infant'].includes(name) 
            ? parseFloat(value) || 0 
            : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: numValue,
            // Auto-set file to tripName if file is empty
            file: name === 'tripName' && !prev.file ? value : prev.file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                date: formData.date ? new Date(formData.date) : new Date(),
                remaining: formData.available - formData.booked,
                file: formData.file || formData.tripName
            };

            let response;
            if (trip) {
                response = await tripsAPI.update(trip._id, payload);
            } else {
                response = await tripsAPI.create(payload);
            }

            if (response.status === 'success') {
                onSuccess();
            }
        } catch (err) {
            setError(err.message || 'Failed to save trip');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-trip" onClick={onClose}>
            <div className="modal-content-trip" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header-trip">
                    <h2 className="modal-title-trip">{trip ? 'Edit Trip' : 'Add Trip'}</h2>
                    <button className="modal-close-trip" onClick={onClose}>✕</button>
                </div>

                {/* Modal Body */}
                <div className="modal-body-trip">
                    {error && <div className="error-message-trip">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid-trip">
                            <div className="form-group">
                                <label>Trip Name *</label>
                                <input
                                    type="text"
                                    name="tripName"
                                    value={formData.tripName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Trip Status</label>
                                <select
                                    name="tripStatus"
                                    value={formData.tripStatus}
                                    onChange={handleChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Not Active">Not Active</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Currency</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                >
                                    <option value="EGP">EGP</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="KWD">KWD</option>
                                    <option value="">-</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Available *</label>
                                <input
                                    type="number"
                                    name="available"
                                    value={formData.available}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Booked</label>
                                <input
                                    type="number"
                                    name="booked"
                                    value={formData.booked}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Adults</label>
                                <input
                                    type="number"
                                    name="adults"
                                    value={formData.adults}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Children</label>
                                <input
                                    type="number"
                                    name="children"
                                    value={formData.children}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Infant</label>
                                <input
                                    type="number"
                                    name="infant"
                                    value={formData.infant}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>File</label>
                                <input
                                    type="text"
                                    name="file"
                                    value={formData.file}
                                    onChange={handleChange}
                                    placeholder="Auto-filled from Trip Name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                >
                                    <option value="Hajj">Hajj</option>
                                    <option value="Umrah">Umrah</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer-trip">
                    <button type="button" className="btn-close-trip" onClick={onClose}>
                        Close
                    </button>
                    <button
                        type="submit"
                        className="btn-save-trip"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTripModal;

