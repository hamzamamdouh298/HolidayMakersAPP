import React, { useState } from 'react';
import { packagesAPI } from '../services/api';
import '../styles/AddPackageModal.css';

const AddPackageModal = ({ isOpen, onClose, onSuccess, package: pkg }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [daysExpanded, setDaysExpanded] = useState(false);
    const [servicesExpanded, setServicesExpanded] = useState({
        hotels: false,
        sightSeeing: false,
        transportation: false,
        extraServices: false,
        guid: false
    });

    const [formData, setFormData] = useState({
        packageName: '',
        cost: 0,
        sellingPrice: 0,
        currency: 'جنيه مصري',
        noDays: 1,
        pricePerAdult: 0,
        pricePerChild: 0,
        priceInclude: '',
        priceNotInclude: ''
    });

    const [services, setServices] = useState({
        hotels: [],
        sightSeeing: [],
        transportation: [],
        extraServices: [],
        guid: []
    });

    React.useEffect(() => {
        if (pkg) {
            setFormData({
                packageName: pkg.packageName || '',
                cost: pkg.cost || 0,
                sellingPrice: pkg.sellingPrice || pkg.pricePerAdult || 0,
                currency: pkg.currency || 'جنيه مصري',
                noDays: pkg.noDays || 1,
                pricePerAdult: pkg.pricePerAdult || 0,
                pricePerChild: pkg.pricePerChild || 0,
                priceInclude: pkg.priceInclude || '',
                priceNotInclude: pkg.priceNotInclude || ''
            });
        } else {
            resetForm();
        }
    }, [pkg, isOpen]);

    const resetForm = () => {
        setFormData({
            packageName: '',
            cost: 0,
            sellingPrice: 0,
            currency: 'جنيه مصري',
            noDays: 1,
            pricePerAdult: 0,
            pricePerChild: 0,
            priceInclude: '',
            priceNotInclude: ''
        });
        setServices({
            hotels: [],
            sightSeeing: [],
            transportation: [],
            extraServices: [],
            guid: []
        });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numValue = ['cost', 'sellingPrice', 'noDays', 'pricePerAdult', 'pricePerChild'].includes(name)
            ? parseFloat(value) || 0
            : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: numValue
        }));
    };

    const handleAddService = (serviceType) => {
        setServices(prev => ({
            ...prev,
            [serviceType]: [...prev[serviceType], { id: Date.now(), name: '' }]
        }));
        setServicesExpanded(prev => ({
            ...prev,
            [serviceType]: true
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                pricePerAdult: formData.sellingPrice || formData.pricePerAdult
            };

            let response;
            if (pkg) {
                response = await packagesAPI.update(pkg._id, payload);
            } else {
                response = await packagesAPI.create(payload);
            }

            if (response.status === 'success') {
                onSuccess();
            }
        } catch (err) {
            setError(err.message || 'Failed to save package');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-package" onClick={onClose}>
            <div className="modal-content-package" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header-package">
                    <h2 className="modal-title-package">Add Package</h2>
                    <button className="modal-close-package" onClick={onClose}>✕</button>
                </div>

                {/* Modal Body */}
                <div className="modal-body-package">
                    {error && <div className="error-message-package">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Package Details */}
                        <div className="form-section-package">
                            <div className="form-row-package">
                                <div className="form-group-package">
                                    <label>Package</label>
                                    <input
                                        type="text"
                                        name="packageName"
                                        value={formData.packageName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group-package">
                                    <label>Cost</label>
                                    <div className="input-with-button">
                                        <input
                                            type="number"
                                            name="cost"
                                            value={formData.cost}
                                            onChange={handleChange}
                                            step="0.01"
                                        />
                                        <button type="button" className="calc-btn">🧮</button>
                                    </div>
                                </div>
                                <div className="form-group-package">
                                    <label>Selling Price</label>
                                    <input
                                        type="number"
                                        name="sellingPrice"
                                        value={formData.sellingPrice}
                                        onChange={handleChange}
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group-package">
                                    <label>Currency</label>
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
                                </div>
                            </div>
                            <div className="form-row-package">
                                <div className="form-group-package">
                                    <label>No. Days</label>
                                    <input
                                        type="number"
                                        name="noDays"
                                        value={formData.noDays}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="days-section">
                                    <label className="days-label">
                                        Days <span className="calendar-icon">📅</span>
                                    </label>
                                    <button
                                        type="button"
                                        className="expand-btn"
                                        onClick={() => setDaysExpanded(!daysExpanded)}
                                    >
                                        {daysExpanded ? '⌄' : '⌃'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Services Section */}
                        <div className="form-section-package">
                            <h3 className="section-title-package">
                                <span className="section-icon">✈️</span>
                                Services
                            </h3>
                            <div className="services-buttons">
                                <button type="button" className="service-add-btn" onClick={() => handleAddService('hotels')}>
                                    Hotel +
                                </button>
                                <button type="button" className="service-add-btn" onClick={() => handleAddService('sightSeeing')}>
                                    SightSeeing +
                                </button>
                                <button type="button" className="service-add-btn" onClick={() => handleAddService('transportation')}>
                                    Transportation +
                                </button>
                                <button type="button" className="service-add-btn" onClick={() => handleAddService('extraServices')}>
                                    Extra Services +
                                </button>
                                <button type="button" className="service-add-btn" onClick={() => handleAddService('guid')}>
                                    guid +
                                </button>
                            </div>

                            {/* Service Sections */}
                            <div className="services-list">
                                <div className="service-item">
                                    <div 
                                        className="service-header"
                                        onClick={() => setServicesExpanded(prev => ({ ...prev, hotels: !prev.hotels }))}
                                    >
                                        <span className="service-icon">🛏️</span>
                                        <span className="service-name">Hotels</span>
                                        <span className="service-count">{services.hotels.length}</span>
                                        <span className="service-arrow">{servicesExpanded.hotels ? '⌄' : '⌃'}</span>
                                    </div>
                                </div>
                                <div className="service-item">
                                    <div 
                                        className="service-header"
                                        onClick={() => setServicesExpanded(prev => ({ ...prev, sightSeeing: !prev.sightSeeing }))}
                                    >
                                        <span className="service-icon">⛰️</span>
                                        <span className="service-name">SightSeeing</span>
                                        <span className="service-count">{services.sightSeeing.length}</span>
                                        <span className="service-arrow">{servicesExpanded.sightSeeing ? '⌄' : '⌃'}</span>
                                    </div>
                                </div>
                                <div className="service-item">
                                    <div 
                                        className="service-header"
                                        onClick={() => setServicesExpanded(prev => ({ ...prev, transportation: !prev.transportation }))}
                                    >
                                        <span className="service-icon">🚌</span>
                                        <span className="service-name">Transportation</span>
                                        <span className="service-count">{services.transportation.length}</span>
                                        <span className="service-arrow">{servicesExpanded.transportation ? '⌄' : '⌃'}</span>
                                    </div>
                                </div>
                                <div className="service-item">
                                    <div 
                                        className="service-header"
                                        onClick={() => setServicesExpanded(prev => ({ ...prev, extraServices: !prev.extraServices }))}
                                    >
                                        <span className="service-icon">⚙️</span>
                                        <span className="service-name">Extra Services</span>
                                        <span className="service-count">{services.extraServices.length}</span>
                                        <span className="service-arrow">{servicesExpanded.extraServices ? '⌄' : '⌃'}</span>
                                    </div>
                                </div>
                                <div className="service-item">
                                    <div 
                                        className="service-header"
                                        onClick={() => setServicesExpanded(prev => ({ ...prev, guid: !prev.guid }))}
                                    >
                                        <span className="service-icon">👤</span>
                                        <span className="service-name">Guid</span>
                                        <span className="service-count">{services.guid.length}</span>
                                        <span className="service-arrow">{servicesExpanded.guid ? '⌄' : '⌃'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Details */}
                        <div className="form-section-package">
                            <div className="price-details-grid">
                                <div className="form-group-package full-width">
                                    <label>Price Include</label>
                                    <textarea
                                        name="priceInclude"
                                        value={formData.priceInclude}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>
                                <div className="form-group-package full-width">
                                    <label>Price Not Include</label>
                                    <textarea
                                        name="priceNotInclude"
                                        value={formData.priceNotInclude}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer-package">
                    <button type="button" className="btn-close-package" onClick={onClose}>
                        Close
                    </button>
                    <button
                        type="submit"
                        className="btn-add-package"
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

export default AddPackageModal;

