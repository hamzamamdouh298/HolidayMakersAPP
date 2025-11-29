import React, { useState, useEffect } from 'react';
import { bagPricesAPI } from '../services/api';
import AddBagPriceModal from '../components/AddBagPriceModal';
import '../styles/BagPricesPage.css';

const BagPricesPage = ({ t, setCurrentPage }) => {
    const [bagPrices, setBagPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [areaFilter, setAreaFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingBagPrice, setEditingBagPrice] = useState(null);

    useEffect(() => {
        fetchBagPrices();
    }, [searchTerm, areaFilter]);

    const fetchBagPrices = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (areaFilter) params.area = areaFilter;
            
            const response = await bagPricesAPI.getAll(params);
            if (response.status === 'success') {
                setBagPrices(response.data.bagPrices || []);
            }
        } catch (err) {
            setError(err.message || 'Failed to load bag prices');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAreaFilter = () => {
        // Toggle area filter or show area selection
        const areas = [...new Set(bagPrices.map(bp => bp.area).filter(Boolean))];
        if (areas.length > 0) {
            const selectedArea = window.prompt('Enter area to filter:', areaFilter);
            if (selectedArea !== null) {
                setAreaFilter(selectedArea);
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bag price?')) {
            return;
        }

        try {
            await bagPricesAPI.delete(id);
            fetchBagPrices();
        } catch (err) {
            alert('Failed to delete bag price: ' + err.message);
        }
    };

    const handleEdit = (bagPrice) => {
        setEditingBagPrice(bagPrice);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingBagPrice(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingBagPrice(null);
    };

    const handleModalSuccess = () => {
        fetchBagPrices();
        handleModalClose();
    };

    const handleImport = () => {
        // Export to Excel (CSV format)
        const csvRows = [];
        
        // Add headers
        csvRows.push(['Area', 'Client', 'Price', 'Currency', 'Fair', 'Fair Rate', 'Max', 'Max Rate', 'Clear']);
        
        // Add data rows
        bagPrices.forEach((bagPrice) => {
            csvRows.push([
                bagPrice.area || '-',
                bagPrice.client || '-',
                bagPrice.price || 0,
                bagPrice.currency || '-',
                bagPrice.fair || 0,
                bagPrice.fairRate || 0,
                bagPrice.max || 0,
                bagPrice.maxRate || 0,
                bagPrice.clear || '-'
            ]);
        });

        // Convert to CSV format
        const csvContent = csvRows.map(row => 
            row.map(cell => {
                // Escape quotes and wrap in quotes if contains comma or newline
                const cellValue = String(cell || '');
                if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
                    return `"${cellValue.replace(/"/g, '""')}"`;
                }
                return cellValue;
            }).join(',')
        ).join('\n');

        // Add BOM for UTF-8 to support Arabic characters
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Create download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bag_prices_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const formatValue = (value) => {
        return value && value !== 0 ? value : '-';
    };

    const filteredBagPrices = bagPrices.filter(bp => {
        if (!searchTerm && !areaFilter) return true;
        const search = searchTerm.toLowerCase();
        const area = areaFilter.toLowerCase();
        return (
            (!searchTerm || (bp.area || '').toLowerCase().includes(search) || (bp.client || '').toLowerCase().includes(search)) &&
            (!areaFilter || (bp.area || '').toLowerCase().includes(area))
        );
    });

    if (loading && bagPrices.length === 0) {
        return (
            <div className="bag-prices-page">
                <div className="loading-message">Loading bag prices...</div>
            </div>
        );
    }

    return (
        <div className="bag-prices-page">
            {/* Header Actions */}
            <div className="bag-prices-header-actions">
                <div className="header-actions-left">
                    <button className="btn-add-header" onClick={handleAddNew}>
                        <span className="btn-icon">➕</span>
                        Add
                    </button>
                    <button className="btn-search-header" onClick={() => document.querySelector('.search-input-bag-prices')?.focus()}>
                        <span className="btn-icon">🔍</span>
                        Search
                    </button>
                    <button className="btn-area-header" onClick={handleAreaFilter}>
                        <span className="btn-icon">📍</span>
                        Area
                    </button>
                </div>
                <div className="header-actions-right">
                    <button className="btn-import-header" onClick={handleImport}>
                        <span className="btn-icon">📄</span>
                        Import
                    </button>
                </div>
            </div>

            {/* Search Input */}
            <div className="search-container-bag-prices">
                <input
                    type="text"
                    className="search-input-bag-prices"
                    placeholder="Search bag prices..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bag-prices-table-container">
                <table className="bag-prices-table">
                    <thead>
                        <tr>
                            <th>Area</th>
                            <th>Client</th>
                            <th>Price</th>
                            <th>Currency</th>
                            <th>Fair</th>
                            <th>Fair Rate</th>
                            <th>Max</th>
                            <th>Max Rate</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBagPrices.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="no-data">
                                    {searchTerm || areaFilter ? 'No bag prices found matching your search' : 'No bag prices yet. Click "Add" to create your first bag price.'}
                                </td>
                            </tr>
                        ) : (
                            filteredBagPrices.map((bagPrice) => (
                                <tr key={bagPrice._id}>
                                    <td>{bagPrice.area || '-'}</td>
                                    <td>{bagPrice.client || '-'}</td>
                                    <td>{bagPrice.price || 0}</td>
                                    <td>{bagPrice.currency || '-'}</td>
                                    <td>{formatValue(bagPrice.fair)}</td>
                                    <td>{formatValue(bagPrice.fairRate)}</td>
                                    <td>{formatValue(bagPrice.max)}</td>
                                    <td>{formatValue(bagPrice.maxRate)}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn-icon btn-edit"
                                            onClick={() => handleEdit(bagPrice)}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-icon btn-delete"
                                            onClick={() => handleDelete(bagPrice._id)}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="bag-prices-footer">
                <div className="total-count">
                    Result : <span className="count-highlight">{filteredBagPrices.length}</span> of <span className="count-highlight">{bagPrices.length}</span> Total
                </div>
                <button className="btn-refresh">🔄</button>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <AddBagPriceModal
                    isOpen={showModal}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                    bagPrice={editingBagPrice}
                />
            )}
        </div>
    );
};

export default BagPricesPage;

