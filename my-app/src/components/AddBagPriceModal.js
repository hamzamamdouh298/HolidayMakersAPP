import React, { useState, useEffect } from 'react';
import { bagPricesAPI } from '../services/api';
import '../styles/AddBagPriceModal.css';

const AddBagPriceModal = ({ isOpen, onClose, onSuccess, bagPrice }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        client: '',
        area: '',
        price: 0,
        currency: 'جنيه مصري',
        fair: 0,
        fairRate: 0,
        max: 0,
        maxRate: 0,
        clear: ''
    });

    useEffect(() => {
        if (bagPrice) {
            setFormData({
                client: bagPrice.client || '',
                area: bagPrice.area || '',
                price: bagPrice.price || 0,
                currency: bagPrice.currency || 'جنيه مصري',
                fair: bagPrice.fair || 0,
                fairRate: bagPrice.fairRate || 0,
                max: bagPrice.max || 0,
                maxRate: bagPrice.maxRate || 0,
                clear: bagPrice.clear || ''
            });
        } else {
            resetForm();
        }
    }, [bagPrice, isOpen]);

    const resetForm = () => {
        setFormData({
            client: '',
            area: '',
            price: 0,
            currency: 'جنيه مصري',
            fair: 0,
            fairRate: 0,
            max: 0,
            maxRate: 0,
            clear: ''
        });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numValue = ['price', 'fair', 'fairRate', 'max', 'maxRate'].includes(name) 
            ? parseFloat(value) || 0 
            : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: numValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            if (bagPrice) {
                response = await bagPricesAPI.update(bagPrice._id, formData);
            } else {
                response = await bagPricesAPI.create(formData);
            }

            if (response.status === 'success') {
                onSuccess();
            }
        } catch (err) {
            setError(err.message || 'Failed to save bag price');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-bag-price" onClick={onClose}>
            <div className="modal-content-bag-price" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header-bag-price">
                    <h2 className="modal-title-bag-price">Add</h2>
                    <button className="modal-close-bag-price" onClick={onClose}>✕</button>
                </div>

                {/* Modal Body */}
                <div className="modal-body-bag-price">
                    {error && <div className="error-message-bag-price">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid-bag-price">
                            {/* First Row */}
                            <div className="form-group">
                                <label>Client</label>
                                <div className="input-with-dropdown">
                                    <input
                                        type="text"
                                        name="client"
                                        value={formData.client}
                                        onChange={handleChange}
                                        list="clients-list"
                                    />
                                    <span className="dropdown-arrow">⌄</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Area</label>
                                <div className="input-with-dropdown">
                                    <input
                                        type="text"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        list="areas-list"
                                    />
                                    <span className="dropdown-arrow">⌄</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Currency</label>
                                <div className="input-with-dropdown">
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                    >
                                        <option value="جنيه مصري">جنيه مصري</option>
                                        <option value="دولار أمريكي">دولار أمريكي</option>
                                        <option value="يورو">يورو</option>
                                        <option value="EGP">EGP</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                    <span className="dropdown-arrow">⌄</span>
                                </div>
                            </div>

                            {/* Second Row */}
                            <div className="form-group">
                                <label>Fair</label>
                                <input
                                    type="number"
                                    name="fair"
                                    value={formData.fair}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Fair Rate</label>
                                <input
                                    type="number"
                                    name="fairRate"
                                    value={formData.fairRate}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Max</label>
                                <input
                                    type="number"
                                    name="max"
                                    value={formData.max}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Max Rate</label>
                                <input
                                    type="number"
                                    name="maxRate"
                                    value={formData.maxRate}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>clear</label>
                                <input
                                    type="text"
                                    name="clear"
                                    value={formData.clear}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer-bag-price">
                    <button type="button" className="btn-close-bag-price" onClick={onClose}>
                        Close
                    </button>
                    <button
                        type="submit"
                        className="btn-add-bag-price"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBagPriceModal;

