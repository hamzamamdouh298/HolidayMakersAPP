import React, { useState, useEffect } from 'react';
import { bagsAPI } from '../services/api';
import '../styles/AddBagModal.css';

const AddBagModal = ({ isOpen, onClose, onSuccess, bag }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        date: '',
        voucherNo: '',
        bagPackagesCount: 0,
        bagPackagesNums: '',
        bagsCount: 0,
        clientPhone: '',
        supervisor: '',
        reportNo: '',
        station: '',
        receiverName: '',
        client: '',
        area: '',
        currency: 'جنيه مصري',
        price: 0,
        byAssistant: false,
        driverName: '',
        vehicle: '',
        vehicleType: '',
        address: '',
        notes: '',
        extra: 0,
        fast: false,
        clear: false,
        clearByBags: false,
        // Additional fields for display
        clientName: '',
        location: '',
        invoiceId: ''
    });

    useEffect(() => {
        if (bag) {
            setFormData({
                date: bag.date ? bag.date.split('T')[0] : '',
                voucherNo: bag.voucherNo || '',
                bagPackagesCount: bag.bagPackagesCount || 0,
                bagPackagesNums: bag.bagPackagesNums || '',
                bagsCount: bag.bagsCount || 0,
                clientPhone: bag.clientPhone || '',
                supervisor: bag.supervisor || '',
                reportNo: bag.reportNo || '',
                station: bag.station || '',
                receiverName: bag.receiverName || '',
                client: bag.client || '',
                area: bag.area || '',
                currency: bag.currency || 'جنيه مصري',
                price: bag.price || 0,
                byAssistant: bag.byAssistant || false,
                driverName: bag.driverName || '',
                vehicle: bag.vehicle || '',
                vehicleType: bag.vehicleType || '',
                address: bag.address || '',
                notes: bag.notes || '',
                extra: bag.extra || 0,
                fast: bag.fast || false,
                clear: bag.clear || false,
                clearByBags: bag.clearByBags || false,
                clientName: bag.clientName || '',
                location: bag.location || '',
                invoiceId: bag.invoiceId || ''
            });
        } else {
            resetForm();
        }
    }, [bag, isOpen]);

    const resetForm = () => {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
            date: today,
            voucherNo: '',
            bagPackagesCount: 0,
            bagPackagesNums: '',
            bagsCount: 0,
            clientPhone: '',
            supervisor: '',
            reportNo: '',
            station: '',
            receiverName: '',
            client: '',
            area: '',
            currency: 'جنيه مصري',
            price: 0,
            byAssistant: false,
            driverName: '',
            vehicle: '',
            vehicleType: '',
            address: '',
            notes: '',
            extra: 0,
            fast: false,
            clear: false,
            clearByBags: false,
            clientName: '',
            location: '',
            invoiceId: ''
        });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value);
        
        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: fieldValue
            };
            
            // Calculate total price
            if (name === 'price' || name === 'extra') {
                updated.totalPrice = updated.price + updated.extra;
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
                date: formData.date ? new Date(formData.date) : new Date(),
                totalPrice: formData.price + formData.extra
            };

            let response;
            if (bag) {
                response = await bagsAPI.update(bag._id, payload);
            } else {
                response = await bagsAPI.create(payload);
            }

            if (response.status === 'success') {
                onSuccess();
            }
        } catch (err) {
            setError(err.message || 'Failed to save bag');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const totalPrice = formData.price + formData.extra;

    return (
        <div className="modal-overlay-bag" onClick={onClose}>
            <div className="modal-content-bag" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header-bag">
                    <h2 className="modal-title-bag">Add Request</h2>
                    <button className="modal-close-bag" onClick={onClose}>✕</button>
                </div>

                {/* Modal Body */}
                <div className="modal-body-bag">
                    {error && <div className="error-message-bag">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* General Request Details */}
                        <div className="form-section">
                            <div className="form-grid-bag">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        placeholder="dd-mm-yyyy"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Voucher No.</label>
                                    <input
                                        type="text"
                                        name="voucherNo"
                                        value={formData.voucherNo}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bag Packages Count</label>
                                    <input
                                        type="number"
                                        name="bagPackagesCount"
                                        value={formData.bagPackagesCount}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bag Packages Nums</label>
                                    <input
                                        type="text"
                                        name="bagPackagesNums"
                                        value={formData.bagPackagesNums}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bags Count</label>
                                    <input
                                        type="number"
                                        name="bagsCount"
                                        value={formData.bagsCount}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Client Phone</label>
                                    <input
                                        type="text"
                                        name="clientPhone"
                                        value={formData.clientPhone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Supervisor</label>
                                    <input
                                        type="text"
                                        name="supervisor"
                                        value={formData.supervisor}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Report No.</label>
                                    <input
                                        type="text"
                                        name="reportNo"
                                        value={formData.reportNo}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Station</label>
                                    <input
                                        type="text"
                                        name="station"
                                        value={formData.station}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Receiver Name</label>
                                    <input
                                        type="text"
                                        name="receiverName"
                                        value={formData.receiverName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Client</label>
                                    <input
                                        type="text"
                                        name="client"
                                        value={formData.client}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Area</label>
                                    <input
                                        type="text"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Currency</label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                    >
                                        <option value="جنيه مصري">جنيه مصري</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="EGP">EGP</option>
                                    </select>
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
                                    />
                                </div>
                            </div>

                            {/* By Assistant Checkbox */}
                            <div className="checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="byAssistant"
                                        checked={formData.byAssistant}
                                        onChange={handleChange}
                                    />
                                    By Assistant
                                </label>
                            </div>
                        </div>

                        {/* Vehicle Section */}
                        <div className="form-section">
                            <h3 className="section-title">Vehicle</h3>
                            <div className="form-grid-bag">
                                <div className="form-group">
                                    <label>Driver Name</label>
                                    <input
                                        type="text"
                                        name="driverName"
                                        value={formData.driverName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Vehicle</label>
                                    <input
                                        type="text"
                                        name="vehicle"
                                        value={formData.vehicle}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Vehicle Type</label>
                                    <input
                                        type="text"
                                        name="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address, Notes, Price, Extra */}
                        <div className="form-section">
                            <div className="form-grid-bag">
                                <div className="form-group full-width">
                                    <label>Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Address"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Total Price</label>
                                    <input
                                        type="number"
                                        name="totalPrice"
                                        value={totalPrice}
                                        readOnly
                                        className="readonly-input"
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
                            </div>

                            {/* Additional Checkboxes */}
                            <div className="checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="fast"
                                        checked={formData.fast}
                                        onChange={handleChange}
                                    />
                                    fast
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="clear"
                                        checked={formData.clear}
                                        onChange={handleChange}
                                    />
                                    clear
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="clearByBags"
                                        checked={formData.clearByBags}
                                        onChange={handleChange}
                                    />
                                    clear by bags
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer-bag">
                    <button type="button" className="btn-close-bag" onClick={onClose}>
                        Close
                    </button>
                    <button
                        type="submit"
                        className="btn-add-bag"
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

export default AddBagModal;

