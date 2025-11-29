import React, { useState, useEffect } from 'react';
import { visasAPI } from '../services/api';
import AddVisaModal from '../components/AddVisaModal';
import '../styles/VisasPage.css';

const VisasPage = ({ t, setCurrentPage }) => {
    const [visas, setVisas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [types, setTypes] = useState(['All']);
    const [showModal, setShowModal] = useState(false);
    const [editingVisa, setEditingVisa] = useState(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchVisas();
        fetchTypes();
    }, [searchTerm, typeFilter]);

    const fetchVisas = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (typeFilter && typeFilter !== 'All') params.type = typeFilter;
            
            const response = await visasAPI.getAll(params);
            if (response.status === 'success') {
                setVisas(response.data.visas || []);
                setTotal(response.data.total || 0);
            }
        } catch (err) {
            setError(err.message || 'Failed to load visas');
        } finally {
            setLoading(false);
        }
    };

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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleTypeChange = (e) => {
        setTypeFilter(e.target.value);
    };

    const handleClear = () => {
        setSearchTerm('');
        setTypeFilter('All');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this visa?')) {
            return;
        }

        try {
            await visasAPI.delete(id);
            fetchVisas();
        } catch (err) {
            alert('Failed to delete visa: ' + err.message);
        }
    };

    const handleEdit = (visa) => {
        setEditingVisa(visa);
        setShowModal(true);
    };

    const handleView = async (id) => {
        try {
            const response = await visasAPI.getById(id);
            if (response.status === 'success') {
                // You can show a view modal or navigate to a detail page
                alert(`Visa: ${response.data.visa.name}\nType: ${response.data.visa.type}\nDescription: ${response.data.visa.description || 'No description'}`);
            }
        } catch (err) {
            alert('Failed to load visa details: ' + err.message);
        }
    };

    const handleAddNew = () => {
        setEditingVisa(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingVisa(null);
    };

    const handleModalSuccess = () => {
        fetchVisas();
        handleModalClose();
    };

    const handleVisaInfo = () => {
        alert('Visa Information: This page shows all company visas with infinite scroll functionality.');
    };

    if (loading && visas.length === 0) {
        return (
            <div className="visas-page">
                <div className="loading-message">Loading visas...</div>
            </div>
        );
    }

    return (
        <div className="visas-page">
            {/* Header Section */}
            <div className="visas-header">
                <div className="header-left">
                    <h1 className="page-title">Visas</h1>
                    <p className="page-description">All company visas with infinite scroll.</p>
                </div>
                <div className="header-right">
                    <button className="btn-visa-info" onClick={handleVisaInfo}>
                        <span className="btn-icon">❓</span>
                        Visa Info
                    </button>
                    <button className="btn-add-visa" onClick={handleAddNew}>
                        <span className="btn-icon">➕</span>
                        Add Visa
                    </button>
                    <div className="total-count-header">
                        Total <span className="count-number">{total}</span>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="visas-filter-card">
                <div className="filter-row">
                    <div className="filter-group">
                        <label className="filter-label">Search</label>
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Visa name / serial / keyword..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">Type</label>
                        <div className="select-wrapper">
                            <select
                                className="type-select"
                                value={typeFilter}
                                onChange={handleTypeChange}
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {typeFilter !== 'All' && (
                                <button 
                                    className="clear-select-btn"
                                    onClick={() => setTypeFilter('All')}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <button className="btn-clear" onClick={handleClear}>
                    <span className="btn-icon">🔄</span>
                    Clear
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* Visas Cards Grid */}
            <div className="visas-grid">
                {visas.length === 0 ? (
                    <div className="no-visas">
                        <p>No visas found. Click "Add Visa" to create your first visa.</p>
                    </div>
                ) : (
                    visas.map((visa) => (
                        <div key={visa._id} className="visa-card">
                            <h3 className="visa-card-title">{visa.name}</h3>
                            <p className="visa-card-serial">Serial #{visa.serialNumber}</p>
                            <div className="visa-card-placeholder">-</div>
                            <div className="visa-card-actions">
                                <button 
                                    className="btn-view"
                                    onClick={() => handleView(visa._id)}
                                >
                                    <span className="btn-icon">👁️</span>
                                    View
                                </button>
                                <button 
                                    className="btn-edit"
                                    onClick={() => handleEdit(visa)}
                                >
                                    <span className="btn-icon">✏️</span>
                                    Edit
                                </button>
                                <button 
                                    className="btn-delete"
                                    onClick={() => handleDelete(visa._id)}
                                >
                                    <span className="btn-icon">🗑️</span>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <AddVisaModal
                    isOpen={showModal}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                    visa={editingVisa}
                />
            )}
        </div>
    );
};

export default VisasPage;

