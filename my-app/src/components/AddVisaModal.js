import React, { useState, useEffect } from 'react';
import { visasAPI } from '../services/api';
import '../styles/AddVisaModal.css';

const AddVisaModal = ({ isOpen, onClose, onSuccess, visa }) => {
    const [activeTab, setActiveTab] = useState('Details');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [types, setTypes] = useState(['All']);
    const [imagePreview, setImagePreview] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        type: 'All',
        description: '',
        image: '',
        requirements: [],
        links: []
    });

    useEffect(() => {
        fetchTypes();
        if (visa) {
            setFormData({
                name: visa.name || '',
                type: visa.type || 'All',
                description: visa.description || '',
                image: visa.image || '',
                requirements: visa.requirements || [],
                links: visa.links || []
            });
            if (visa.image) {
                setImagePreview(visa.image);
            }
        } else {
            resetForm();
        }
    }, [visa, isOpen]);

    const fetchTypes = async () => {
        try {
            const response = await visasAPI.getTypes();
            if (response.status === 'success') {
                setTypes(response.data.types || ['All']);
            }
        } catch (err) {
            console.error('Failed to fetch visa types:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'All',
            description: '',
            image: '',
            requirements: [],
            links: []
        });
        setImagePreview('');
        setActiveTab('Details');
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }

            // Check file type
            if (!file.type.match('image/(jpeg|jpg|png)')) {
                setError('Only JPG and PNG images are allowed');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    image: reader.result // Base64 string
                }));
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleRequirementChange = (index, field, value) => {
        const newRequirements = [...formData.requirements];
        newRequirements[index] = {
            ...newRequirements[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            requirements: newRequirements
        }));
    };

    const addRequirement = () => {
        setFormData(prev => ({
            ...prev,
            requirements: [...prev.requirements, { title: '', description: '', isRequired: false }]
        }));
    };

    const removeRequirement = (index) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...formData.links];
        newLinks[index] = {
            ...newLinks[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            links: newLinks
        }));
    };

    const addLink = () => {
        setFormData(prev => ({
            ...prev,
            links: [...prev.links, { title: '', url: '', description: '' }]
        }));
    };

    const removeLink = (index) => {
        setFormData(prev => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            if (visa) {
                response = await visasAPI.update(visa._id, formData);
            } else {
                response = await visasAPI.create(formData);
            }

            if (response.status === 'success') {
                onSuccess();
            }
        } catch (err) {
            setError(err.message || 'Failed to save visa');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-visa" onClick={onClose}>
            <div className="modal-content-visa" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header-visa">
                    <h2 className="modal-title-visa">{visa ? 'Edit Visa' : 'Add Visa'}</h2>
                    <button className="modal-close-visa" onClick={onClose}>✕</button>
                </div>

                {/* Tabs */}
                <div className="modal-tabs">
                    <button
                        className={`tab-button ${activeTab === 'Details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Details')}
                    >
                        Details
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'Requirements' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Requirements')}
                    >
                        Requirements
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'Links' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Links')}
                    >
                        Links
                    </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body-visa">
                    {error && <div className="error-message-visa">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Details Tab */}
                        {activeTab === 'Details' && (
                            <div className="tab-content">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        <div className="type-select-wrapper">
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                required
                                            >
                                                {types.filter(t => t !== 'All').map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            <button type="button" className="btn-manage-type">Manage</button>
                                            {formData.type !== 'All' && (
                                                <button
                                                    type="button"
                                                    className="clear-type-btn"
                                                    onClick={() => setFormData(prev => ({ ...prev, type: 'All' }))}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Image (JPG/PNG, max ~5MB)</label>
                                    <div className="image-upload-area">
                                        {imagePreview ? (
                                            <div className="image-preview">
                                                <img src={imagePreview} alt="Preview" />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => {
                                                        setImagePreview('');
                                                        setFormData(prev => ({ ...prev, image: '' }));
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="image-upload-label">
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png"
                                                    onChange={handleImageChange}
                                                    style={{ display: 'none' }}
                                                />
                                                <div className="upload-placeholder">
                                                    <span className="upload-icon">🏔️</span>
                                                    <p>Drop image here or click to upload</p>
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Requirements Tab */}
                        {activeTab === 'Requirements' && (
                            <div className="tab-content">
                                <div className="requirements-header">
                                    <h3>Requirements</h3>
                                    <button type="button" className="btn-add-requirement" onClick={addRequirement}>
                                        + Add Requirement
                                    </button>
                                </div>
                                {formData.requirements.map((req, index) => (
                                    <div key={index} className="requirement-item">
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                value={req.title}
                                                onChange={(e) => handleRequirementChange(index, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea
                                                value={req.description}
                                                onChange={(e) => handleRequirementChange(index, 'description', e.target.value)}
                                                rows="2"
                                            />
                                        </div>
                                        <div className="form-group-checkbox">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={req.isRequired}
                                                    onChange={(e) => handleRequirementChange(index, 'isRequired', e.target.checked)}
                                                />
                                                Required
                                            </label>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-remove-requirement"
                                            onClick={() => removeRequirement(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                {formData.requirements.length === 0 && (
                                    <p className="empty-message">No requirements added. Click "Add Requirement" to add one.</p>
                                )}
                            </div>
                        )}

                        {/* Links Tab */}
                        {activeTab === 'Links' && (
                            <div className="tab-content">
                                <div className="links-header">
                                    <h3>Links</h3>
                                    <button type="button" className="btn-add-link" onClick={addLink}>
                                        + Add Link
                                    </button>
                                </div>
                                {formData.links.map((link, index) => (
                                    <div key={index} className="link-item">
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                value={link.title}
                                                onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>URL</label>
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea
                                                value={link.description}
                                                onChange={(e) => handleLinkChange(index, 'description', e.target.value)}
                                                rows="2"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-remove-link"
                                            onClick={() => removeLink(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                {formData.links.length === 0 && (
                                    <p className="empty-message">No links added. Click "Add Link" to add one.</p>
                                )}
                            </div>
                        )}
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer-visa">
                    <button type="button" className="btn-close-visa" onClick={onClose}>
                        <span className="btn-icon">✕</span>
                        Close
                    </button>
                    <button
                        type="submit"
                        className="btn-save-visa"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        <span className="btn-icon">💾</span>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddVisaModal;

