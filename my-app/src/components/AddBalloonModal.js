import React, { useState, useEffect } from 'react';
import { balloonsAPI } from '../services/api';
import '../styles/AddBalloonModal.css';

const AddBalloonModal = ({ isOpen, onClose, onSuccess, balloon }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        customer: '',
        cost: 0,
        supplier: '',
        entryId: 'UnConfirm',
        price: 0,
        pax: 1,
        discount: 0,
        extra: 0,
        totalPrice: 0,
        currency: 'EGP',
        rate: 1,
        trip: '',
        balloon: '',
        operationDate: ''
    });

    useEffect(() => {
        if (balloon) {
            setFormData({
                customer: balloon.customer || '',
                cost: balloon.cost || 0,
                supplier: balloon.supplier || '',
                entryId: balloon.entryId || 'UnConfirm',
                price: balloon.price || 0,
                pax: balloon.pax || 1,
                discount: balloon.discount || 0,
                extra: balloon.extra || 0,
                totalPrice: balloon.totalPrice || 0,
                currency: balloon.currency || 'EGP',
                rate: balloon.rate || 1,
                trip: balloon.trip || '',
                balloon: balloon.balloon || '',
                operationDate: balloon.operationDate ? balloon.operationDate.split('T')[0] : ''
            });
        } else {
            resetForm();
        }
    }, [balloon, isOpen]);

    const resetForm = () => {
        setFormData({
            customer: '',
            cost: 0,
            supplier: '',
            entryId: 'UnConfirm',
            price: 0,
            pax: 1,
            discount: 0,
            extra: 0,
            totalPrice: 0,
            currency: 'EGP',
            rate: 1,
            trip: '',
            balloon: '',
            operationDate: ''
        });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numValue = ['cost', 'price', 'pax', 'discount', 'extra', 'rate'].includes(name) 
            ? parseFloat(value) || 0 
            : value;
        
        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: numValue
            };
            
            // Calculate total price
            if (['price', 'pax', 'discount', 'extra'].includes(name)) {
                updated.totalPrice = (updated.price * updated.pax) - updated.discount + updated.extra;
            }
            
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                operationDate: formData.operationDate ? new Date(formData.operationDate) : null
            };

            let response;
            if (balloon) {
                response = await balloonsAPI.update(balloon._id, payload);
            } else {
                response = await balloonsAPI.create(payload);
            }

            if (response.status === 'success') {
                onSuccess();
            }
        } catch (err) {
            setError(err.message || 'Failed to save balloon');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-balloon" onClick={onClose}>
            <div className="modal-content-balloon" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header-balloon">
                    <h2 className="modal-title-balloon">{balloon ? 'Edit Balloon' : 'Add Balloon'}</h2>
                    <button className="modal-close-balloon" onClick={onClose}>✕</button>
                </div>

                {/* Modal Body */}
                <div className="modal-body-balloon">
                    {error && <div className="error-message-balloon">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid-balloon">
                            <div className="form-group">
                                <label>Customer *</label>
                                <input
                                    type="text"
                                    name="customer"
                                    value={formData.customer}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Cost</label>
                                <input
                                    type="number"
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    step="0.01"
                                />
                            </div>
                            <div className="form-group">
                                <label>Supplier</label>
                                <input
                                    type="text"
                                    name="supplier"
                                    value={formData.supplier}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Entry ID</label>
                                <select
                                    name="entryId"
                                    value={formData.entryId}
                                    onChange={handleChange}
                                >
                                    <option value="UnConfirm">UnConfirm</option>
                                    <option value="Confirm">Confirm</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Price *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Pax</label>
                                <input
                                    type="number"
                                    name="pax"
                                    value={formData.pax}
                                    onChange={handleChange}
                                    min="1"
                                />
                            </div>
                            <div className="form-group">
                                <label>Discount</label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Extra</label>
                                <input
                                    type="number"
                                    name="extra"
                                    value={formData.extra}
                                    onChange={handleChange}
                                    step="0.01"
                                />
                            </div>
                            <div className="form-group">
                                <label>Total Price</label>
                                <input
                                    type="number"
                                    name="totalPrice"
                                    value={formData.totalPrice}
                                    readOnly
                                    className="readonly-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Currency *</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="EGP">EGP</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Rate</label>
                                <input
                                    type="number"
                                    name="rate"
                                    value={formData.rate}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Trip</label>
                                <input
                                    type="text"
                                    name="trip"
                                    value={formData.trip}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Balloon</label>
                                <input
                                    type="text"
                                    name="balloon"
                                    value={formData.balloon}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Operation Date</label>
                                <input
                                    type="date"
                                    name="operationDate"
                                    value={formData.operationDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer-balloon">
                    <button type="button" className="btn-close-balloon" onClick={onClose}>
                        Close
                    </button>
                    <button
                        type="submit"
                        className="btn-save-balloon"
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

export default AddBalloonModal;

