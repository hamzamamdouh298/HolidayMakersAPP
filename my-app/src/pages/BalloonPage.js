import React, { useState, useEffect } from 'react';
import { balloonsAPI } from '../services/api';
import AddBalloonModal from '../components/AddBalloonModal';
import '../styles/BalloonPage.css';

const BalloonPage = ({ t, setCurrentPage }) => {
    const [balloons, setBalloons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingBalloon, setEditingBalloon] = useState(null);

    useEffect(() => {
        fetchBalloons();
    }, [searchTerm]);

    const fetchBalloons = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            
            const response = await balloonsAPI.getAll(params);
            if (response.status === 'success') {
                setBalloons(response.data.balloons || []);
            }
        } catch (err) {
            setError(err.message || 'Failed to load balloons');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this balloon?')) {
            return;
        }

        try {
            await balloonsAPI.delete(id);
            fetchBalloons();
        } catch (err) {
            alert('Failed to delete balloon: ' + err.message);
        }
    };

    const handleEdit = (balloon) => {
        setEditingBalloon(balloon);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingBalloon(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingBalloon(null);
    };

    const handleModalSuccess = () => {
        fetchBalloons();
        handleModalClose();
    };

    const handleDownloadExcel = () => {
        const csvRows = [];
        csvRows.push(['ID', 'Customer', 'Cost', 'Supplier', 'Entry ID', 'Price', 'Pax', 'Discount', 'Extra', 'Total Price', 'Currency', 'Rate', 'Trip', 'Balloon', 'Creation Date', 'Operation Date']);
        
        balloons.forEach((balloon, index) => {
            csvRows.push([
                index + 1,
                balloon.customer || '-',
                balloon.cost || 0,
                balloon.supplier || '-',
                balloon.entryId || '-',
                balloon.price || 0,
                balloon.pax || 0,
                balloon.discount || 0,
                balloon.extra || 0,
                balloon.totalPrice || 0,
                balloon.currency || 'EGP',
                balloon.rate || 1,
                balloon.trip || '-',
                balloon.balloon || '-',
                formatDate(balloon.createdAt),
                formatDate(balloon.operationDate)
            ]);
        });

        const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `balloons_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadPDF = () => {
        alert('PDF export functionality will be implemented');
    };

    const handleCountReport = async () => {
        try {
            const response = await balloonsAPI.getCountReport();
            if (response.status === 'success') {
                alert(`Total Balloons: ${response.data.count}`);
            }
        } catch (err) {
            alert('Failed to get count report: ' + err.message);
        }
    };

    const handleProfitReport = async () => {
        try {
            const response = await balloonsAPI.getProfitReport();
            if (response.status === 'success') {
                alert(`Total Profit: ${response.data.totalProfit} EGP`);
            }
        } catch (err) {
            alert('Failed to get profit report: ' + err.message);
        }
    };

    const handleSupplierReport = async () => {
        try {
            const response = await balloonsAPI.getSupplierReport();
            if (response.status === 'success') {
                const report = response.data.supplierStats.map(s => 
                    `${s._id || 'Unknown'}: ${s.count} balloons, Revenue: ${s.totalRevenue} EGP`
                ).join('\n');
                alert(`Supplier Report:\n\n${report || 'No data available'}`);
            }
        } catch (err) {
            alert('Failed to get supplier report: ' + err.message);
        }
    };

    const handleToggleEntryId = async (balloon) => {
        try {
            const newEntryId = balloon.entryId === 'Confirm' ? 'UnConfirm' : 'Confirm';
            await balloonsAPI.update(balloon._id, { entryId: newEntryId });
            fetchBalloons();
        } catch (err) {
            alert('Failed to update entry ID: ' + err.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toISOString().replace('T', ' ').substring(0, 19);
    };

    const filteredBalloons = balloons.filter(balloon => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            (balloon.customer || '').toLowerCase().includes(search) ||
            (balloon.supplier || '').toLowerCase().includes(search) ||
            (balloon.trip || '').toLowerCase().includes(search) ||
            (balloon.balloon || '').toLowerCase().includes(search)
        );
    });

    if (loading && balloons.length === 0) {
        return (
            <div className="balloon-page">
                <div className="loading-message">Loading balloons...</div>
            </div>
        );
    }

    return (
        <div className="balloon-page">
            {/* Header */}
            <div className="balloon-header">
                <h1 className="page-title">Balloon</h1>
            </div>

            {/* List Section */}
            <div className="balloon-list-section">
                <h2 className="list-title">List</h2>
                
                {/* Action Buttons */}
                <div className="balloon-actions">
                    <button className="btn-action" onClick={handleDownloadExcel}>
                        <span className="btn-icon">📥</span>
                        Download Excel
                    </button>
                    <button className="btn-action" onClick={handleDownloadPDF}>
                        <span className="btn-icon">📥</span>
                        Download PDF
                    </button>
                    <button className="btn-action" onClick={handleCountReport}>
                        Count Report
                    </button>
                    <button className="btn-action" onClick={handleProfitReport}>
                        Profit Report
                    </button>
                    <button className="btn-action" onClick={handleSupplierReport}>
                        Supplier Report
                    </button>
                    <button className="btn-search" onClick={() => document.querySelector('.search-input-balloon')?.focus()}>
                        <span className="btn-icon">🔍</span>
                        Search
                    </button>
                    <button className="btn-add" onClick={handleAddNew}>
                        <span className="btn-icon">➕</span>
                        Add
                    </button>
                </div>

                {/* Search Input */}
                <div className="search-container-balloon">
                    <input
                        type="text"
                        className="search-input-balloon"
                        placeholder="Search balloons..."
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
                <div className="balloon-table-container">
                    <table className="balloon-table">
                        <thead>
                            <tr>
                                <th>
                                    ID <span className="sort-arrow">⌄</span>
                                </th>
                                <th>Customer</th>
                                <th>Cost</th>
                                <th>Supplier</th>
                                <th>Entry ID</th>
                                <th>Price</th>
                                <th>Pax</th>
                                <th>Discount</th>
                                <th>Extra</th>
                                <th>Total Price</th>
                                <th>Currency</th>
                                <th>rate</th>
                                <th>Trip</th>
                                <th>Balloon</th>
                                <th>Creation Date</th>
                                <th>Operation Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBalloons.length === 0 ? (
                                <tr>
                                    <td colSpan="17" className="no-data">
                                        {searchTerm ? 'No balloons found matching your search' : 'No balloons yet. Click "Add" to create your first balloon.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredBalloons.map((balloon, index) => (
                                    <tr key={balloon._id}>
                                        <td>{index + 1}</td>
                                        <td>{balloon.customer || '-'}</td>
                                        <td>{balloon.cost || 0}</td>
                                        <td>{balloon.supplier || '-'}</td>
                                        <td>
                                            {balloon.entryId === 'UnConfirm' ? (
                                                <button 
                                                    className="btn-entry-unconfirm"
                                                    onClick={() => handleToggleEntryId(balloon)}
                                                >
                                                    UnConfirm
                                                </button>
                                            ) : (
                                                <span className="entry-confirm">{balloon.entryId || '-'}</span>
                                            )}
                                        </td>
                                        <td>{balloon.price || 0}</td>
                                        <td>{balloon.pax || 0}</td>
                                        <td>{balloon.discount || 0}</td>
                                        <td>{balloon.extra || 0}</td>
                                        <td className="total-price-cell">{balloon.totalPrice || 0}</td>
                                        <td>{balloon.currency || 'EGP'}</td>
                                        <td>{balloon.rate || 1}</td>
                                        <td>{balloon.trip || '-'}</td>
                                        <td>{balloon.balloon || '-'}</td>
                                        <td>{formatDateTime(balloon.createdAt)}</td>
                                        <td>{formatDate(balloon.operationDate)}</td>
                                        <td className="actions-cell">
                                            <button
                                                className="btn-icon btn-edit"
                                                onClick={() => handleEdit(balloon)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-icon btn-delete"
                                                onClick={() => handleDelete(balloon._id)}
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
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <AddBalloonModal
                    isOpen={showModal}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                    balloon={editingBalloon}
                />
            )}
        </div>
    );
};

export default BalloonPage;

