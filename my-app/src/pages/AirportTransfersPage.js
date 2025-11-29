import React, { useState, useEffect } from 'react';
import { airportTransfersAPI } from '../services/api';
import AddAirportTransferModal from '../components/AddAirportTransferModal';
import '../styles/AirportTransfersPage.css';

const AirportTransfersPage = ({ t, setCurrentPage }) => {
    const [transfers, setTransfers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const [showModal, setShowModal] = useState(false);
const [editingTransfer, setEditingTransfer] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
    fetchTransfers();
}, []);

    const fetchTransfers = async () => {
    setLoading(true);
setError('');
try {
    const response = await airportTransfersAPI.getAll();
    if (response.status === 'success') {
        setTransfers(response.data.transfers || []);
    }
} catch (err) {
    setError(err.message || 'Failed to load airport transfers');
} finally {
    setLoading(false);
}
  };

    const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

    const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transfer?')) {
    return;
}

try {
    await airportTransfersAPI.delete(id);
    fetchTransfers();
} catch (err) {
    alert('Failed to delete transfer: ' + err.message);
}
  };

    const handleEdit = (transfer) => {
    setEditingTransfer(transfer);
setShowModal(true);
  };

    const handleAddNew = () => {
    setEditingTransfer(null);
setShowModal(true);
  };

    const handleModalClose = () => {
    setShowModal(false);
setEditingTransfer(null);
  };

    const handleModalSuccess = () => {
    fetchTransfers();
handleModalClose();
  };

    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(filteredTransfers.map(t => t._id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleExportExcel = () => {
    const csvRows = [];
        csvRows.push(['#', 'Customer Name', 'Date', 'Receiver Name', 'Sale Price', 'Delegate Name', 'Currency', 'Commission', 'Entry ID', 'Driver Name', 'Branch', 'Created At', 'Start Location']);
        
        filteredTransfers.forEach((transfer, index) => {
            csvRows.push([
                filteredTransfers.length - index,
                transfer.customerName || transfer.guestName || '-',
                formatDate(transfer.date),
                transfer.receiverName || '-',
                transfer.salePrice || 0,
                transfer.delegateName || '-',
                transfer.currency || 'EGP',
                transfer.commission || '-',
                transfer.entryId || '-',
                transfer.driverName || '-',
                transfer.branch || '-',
                formatDate(transfer.createdAt),
                transfer.startLocation || '-'
            ]);
        });

        const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
const link = document.createElement('a');
const url = URL.createObjectURL(blob);
link.setAttribute('href', url);
        link.setAttribute('download', `airport_transfers_${new Date().toISOString().split('T')[0]}.csv`);
link.style.visibility = 'hidden';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
  };

    const handleExportPDF = () => {
        alert('PDF export functionality will be implemented');
    };

    const handleImportPaymentEntry = () => {
        alert('Import Payment Entry functionality will be implemented');
    };

    const handleImportEntityCar = () => {
        alert('Import Entity Car functionality will be implemented');
    };

    const handleImportFile = () => {
        alert('Import File functionality will be implemented');
    };

    const handleImportErrors = () => {
        alert('Import Errors functionality will be implemented');
    };

    const handleToggleEntryId = async (transfer) => {
        try {
            const newEntryId = transfer.entryId === 'Confirm' ? 'UnConfirm' : 'Confirm';
            await airportTransfersAPI.update(transfer._id, { entryId: newEntryId });
            fetchTransfers();
        } catch (err) {
            alert('Failed to update entry ID: ' + err.message);
        }
    };

    const filteredTransfers = transfers.filter(transfer => {
    const search = searchTerm.toLowerCase();
        return (
            (transfer.customerName || transfer.guestName || '').toLowerCase().includes(search) ||
            (transfer.driverName || '').toLowerCase().includes(search) ||
            (transfer.serialNumber || '').toString().includes(search) ||
            (transfer.vehicle || '').toLowerCase().includes(search) ||
            (transfer.station || '').toLowerCase().includes(search) ||
            (transfer.startLocation || '').toLowerCase().includes(search) ||
            (transfer.branch || '').toString().includes(search)
    );
  });

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

    const getCurrencyDisplay = (currency) => {
        const currencyMap = {
            'EGP': 'جنيه مصري',
            'USD': 'دولار أمريكي',
            'EUR': 'يورو'
        };
        return currencyMap[currency] || currency || 'جنيه مصري';
  };

if (loading) {
    return (
            <div className="airport-transfers-page">
                <div className="loading-message">Loading airport transfers...</div>
            </div>
    );
}

return (
        <div className="airport-transfers-page">
            {/* Header Section with Import Errors, Search, and Add buttons */}
            <div className="airport-transfers-top-header">
                <button className="btn-import-errors" onClick={handleImportErrors}>
                    ▲ Import Errors
                </button>
                <button className="btn-search-header" onClick={() => document.querySelector('.search-input-main')?.focus()}>
                    🔍 Q Search
                </button>
                <button className="btn-add-transfer-header" onClick={handleAddNew}>
                    ➕ Add Airport Transfer
                </button>
            </div>

            {/* Action Toolbar */}
            <div className="airport-transfers-toolbar">
                <button className="toolbar-btn toolbar-download" title="Download">
                    <span className="btn-icon">📥</span>
                </button>
                <button className="toolbar-btn toolbar-import" onClick={handleImportPaymentEntry}>
                    <span className="btn-icon">↑</span>
                    Import Payment Entry
                </button>
                <button className="toolbar-btn toolbar-download" title="Download">
                    <span className="btn-icon">📥</span>
                </button>
                <button className="toolbar-btn toolbar-import" onClick={handleImportEntityCar}>
                    <span className="btn-icon">🚗</span>
                    Import Entity Car
                </button>
                <button className="toolbar-btn toolbar-import" onClick={handleImportFile}>
                    <span className="btn-icon">↑</span>
          Import File
                </button>
                <button className="toolbar-btn toolbar-excel" onClick={handleExportExcel}>
                    <span className="btn-icon">📊</span>
          Export Excel
                </button>
                <button className="toolbar-btn toolbar-pdf" onClick={handleExportPDF}>
                    <span className="btn-icon">📄</span>
          Export PDF
                </button>
            </div>

            {/* Search Input */}
            <div className="search-container-main">
                <input
                    type="text"
                    className="search-input-main"
                    placeholder="Search transfers..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* List Section */}
            <div className="airport-transfers-list-section">
                <h2 className="list-title">List</h2>
                <div className="airport-transfers-table-container">
                    <table className="airport-transfers-table">
                        <thead>
                            <tr>
                                <th>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedRows.length === filteredTransfers.length && filteredTransfers.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>
                                    # <span className="sort-arrow">⌄</span>
                                </th>
                                <th>Customer Name</th>
                                <th>Date</th>
                                <th>Receiver Name</th>
                                <th>Sale Price</th>
                                <th>Delegate Name</th>
                                <th>Currency</th>
                                <th>Commission</th>
                                <th>Entry ID</th>
                                <th>Driver Name</th>
                                <th>Branch</th>
                                <th>Created At</th>
                                <th>Start Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransfers.length === 0 ? (
                                <tr>
                                    <td colSpan="14" className="no-data">
                                        {searchTerm ? 'No transfers found matching your search' : 'No airport transfers yet. Click "Add Airport Transfer" to get started.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredTransfers.map((transfer, index) => (
                                    <tr key={transfer._id}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedRows.includes(transfer._id)}
                                                onChange={() => handleRowSelect(transfer._id)}
                                            />
                                        </td>
                                        <td>{filteredTransfers.length - index}</td>
                                        <td>{transfer.customerName || transfer.guestName || '-'}</td>
                                        <td>{formatDate(transfer.date)}</td>
                                        <td>{transfer.receiverName || '-'}</td>
                                        <td className="price-cell">{transfer.salePrice || 0}</td>
                                        <td>{transfer.delegateName || '-'}</td>
                                        <td>{getCurrencyDisplay(transfer.currency)}</td>
                                        <td>{transfer.commission || '-'}</td>
                                        <td>
                                            {transfer.entryId === 'UnConfirm' ? (
                                                <button 
                                                    className="btn-entry-unconfirm"
                                                    onClick={() => handleToggleEntryId(transfer)}
                                                >
                                                    UnConfirm
                                                </button>
                                            ) : (
                                                <span className="entry-confirm">{transfer.entryId || '-'}</span>
                                            )}
                                        </td>
                                        <td>{transfer.driverName || '-'}</td>
                                        <td>{transfer.branch || '-'}</td>
                                        <td>{formatDateTime(transfer.createdAt)}</td>
                                        <td>{transfer.startLocation || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="airport-transfers-footer">
                <div className="total-count">
                    Result: <span className="count-highlight">{filteredTransfers.length}</span> of <span className="count-highlight">{transfers.length}</span> Total
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <AddAirportTransferModal
                    isOpen={showModal}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                    transfer={editingTransfer}
                />
            )}
        </div>
  );
};

export default AirportTransfersPage;
