import React, { useState, useEffect } from 'react';
import { bagsAPI } from '../services/api';
import AddBagModal from '../components/AddBagModal';
import '../styles/BagsPage.css';

const BagsPage = ({ t, setCurrentPage }) => {
    const [bags, setBags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingBag, setEditingBag] = useState(null);
    const [selectedBags, setSelectedBags] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        fetchBags();
    }, [searchTerm]);

    const fetchBags = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            
            const response = await bagsAPI.getAll(params);
            if (response.status === 'success') {
                setBags(response.data.bags || []);
            }
        } catch (err) {
            setError(err.message || 'Failed to load bags');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bag?')) {
            return;
        }

        try {
            await bagsAPI.delete(id);
            fetchBags();
        } catch (err) {
            alert('Failed to delete bag: ' + err.message);
        }
    };

    const handleEdit = (bag) => {
        setEditingBag(bag);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingBag(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingBag(null);
    };

    const handleModalSuccess = () => {
        fetchBags();
        handleModalClose();
    };

    const handleToggleEntryId = async (bag) => {
        try {
            await bagsAPI.toggleEntryId(bag._id);
            fetchBags();
        } catch (err) {
            alert('Failed to toggle entry ID: ' + err.message);
        }
    };

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            setSelectedBags(bags.map(bag => bag._id));
        } else {
            setSelectedBags([]);
        }
    };

    const handleSelectBag = (bagId) => {
        if (selectedBags.includes(bagId)) {
            setSelectedBags(selectedBags.filter(id => id !== bagId));
            setSelectAll(false);
        } else {
            setSelectedBags([...selectedBags, bagId]);
            if (selectedBags.length + 1 === bags.length) {
                setSelectAll(true);
            }
        }
    };

    const handleDownloadExcel = () => {
        const csvRows = [];
        csvRows.push(['Voucher No.', 'Date', 'Entry ID', 'Supervisor', 'Client Name', 'Location', 'Report No.', 'Bags Count', 'Station', 'Total Price', 'Currency', 'Invoice Id']);
        
        bags.forEach((bag) => {
            csvRows.push([
                bag.voucherNo || '-',
                formatDate(bag.date),
                bag.entryId || '-',
                bag.supervisor || '-',
                bag.clientName || '-',
                bag.location || '-',
                bag.reportNo || '-',
                bag.bagsCount || 0,
                bag.station || '-',
                bag.totalPrice || 0,
                bag.currency || '-',
                bag.invoiceId || '-'
            ]);
        });

        const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bags_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExample = () => {
        alert('Example functionality will be implemented');
    };

    const handleImport = () => {
        alert('Import functionality will be implemented');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const totalBagsCount = bags.reduce((sum, bag) => sum + (bag.bagsCount || 0), 0);

    const filteredBags = bags.filter(bag => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            (bag.voucherNo || '').toLowerCase().includes(search) ||
            (bag.clientName || '').toLowerCase().includes(search) ||
            (bag.supervisor || '').toLowerCase().includes(search) ||
            (bag.location || '').toLowerCase().includes(search) ||
            (bag.station || '').toLowerCase().includes(search) ||
            (bag.invoiceId || '').toLowerCase().includes(search)
        );
    });

    if (loading && bags.length === 0) {
        return (
            <div className="bags-page">
                <div className="loading-message">Loading bags...</div>
            </div>
        );
    }

    return (
        <div className="bags-page">
            {/* Header Buttons */}
            <div className="bags-header-actions">
                <button className="btn-add-header" onClick={handleAddNew}>
                    <span className="btn-icon">➕</span>
                </button>
                <button className="btn-search-header" onClick={() => document.querySelector('.search-input-bags')?.focus()}>
                    <span className="btn-icon">🔍</span>
                    Q
                </button>
            </div>

            {/* Main Content */}
            <div className="bags-content">
                <h1 className="bags-title">Bags</h1>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {/* Search Input */}
                <div className="search-container-bags">
                    <input
                        type="text"
                        className="search-input-bags"
                        placeholder="Search bags..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                {/* Table */}
                <div className="bags-table-container">
                    <table className="bags-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>Voucher No.</th>
                                <th>Date</th>
                                <th>Entry ID</th>
                                <th>Supervisor</th>
                                <th>Client Name</th>
                                <th>Location</th>
                                <th>Report No.</th>
                                <th>Bags Count</th>
                                <th>Station</th>
                                <th>Total Price</th>
                                <th>Currency</th>
                                <th>Invoice Id</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBags.length === 0 ? (
                                <tr>
                                    <td colSpan="14" className="no-data">
                                        {searchTerm ? 'No bags found matching your search' : 'No bags yet. Click "+" to create your first bag.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredBags.map((bag) => (
                                    <tr key={bag._id} className={selectedBags.includes(bag._id) ? 'row-selected' : ''}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedBags.includes(bag._id)}
                                                onChange={() => handleSelectBag(bag._id)}
                                            />
                                        </td>
                                        <td>{bag.voucherNo || '-'}</td>
                                        <td>{formatDate(bag.date)}</td>
                                        <td>
                                            {bag.entryId === 'UnConfirm' ? (
                                                <button 
                                                    className="btn-entry-unconfirm"
                                                    onClick={() => handleToggleEntryId(bag)}
                                                >
                                                    UnConfirm
                                                </button>
                                            ) : (
                                                <span className="entry-confirm">{bag.entryId || '-'}</span>
                                            )}
                                        </td>
                                        <td>{bag.supervisor || '-'}</td>
                                        <td>{bag.clientName || '-'}</td>
                                        <td>{bag.location || '-'}</td>
                                        <td>{bag.reportNo || '-'}</td>
                                        <td>{bag.bagsCount || 0}</td>
                                        <td>{bag.station || '-'}</td>
                                        <td className="total-price-cell">{bag.totalPrice || 0}</td>
                                        <td>{bag.currency || '-'}</td>
                                        <td>
                                            {bag.invoiceId ? (
                                                <a href={`#invoice-${bag.invoiceId}`} className="invoice-link">
                                                    {bag.invoiceId}
                                                </a>
                                            ) : '-'}
                                        </td>
                                        <td className="actions-cell">
                                            <button
                                                className="btn-icon btn-edit"
                                                onClick={() => handleEdit(bag)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-icon btn-delete"
                                                onClick={() => handleDelete(bag._id)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="table-footer-row">
                                <td colSpan="8"></td>
                                <td>
                                    <input
                                        type="number"
                                        className="footer-bags-count"
                                        value={totalBagsCount}
                                        readOnly
                                    />
                                </td>
                                <td colSpan="5"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer */}
                <div className="bags-footer">
                    <div className="total-count">
                        Result: <span className="count-highlight">{filteredBags.length}</span> of <span className="count-highlight">{bags.length}</span> Total
                    </div>
                    <div className="pagination-controls">
                        <button className="btn-refresh">🔄</button>
                        <select className="items-per-page">
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="bags-bottom-actions">
                <button className="btn-download-excel-bottom" onClick={handleDownloadExcel}>
                    <span className="btn-icon">📊</span>
                    Download Excel
                </button>
                <button className="btn-example" onClick={handleExample}>
                    <span className="btn-icon">📊</span>
                    Example
                </button>
                <button className="btn-import" onClick={handleImport}>
                    <span className="btn-icon">📊</span>
                    Import
                </button>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <AddBagModal
                    isOpen={showModal}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                    bag={editingBag}
                />
            )}
        </div>
    );
};

export default BagsPage;

