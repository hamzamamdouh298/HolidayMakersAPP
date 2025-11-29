import React, { useState, useEffect } from 'react';
import { tripsAPI } from '../services/api';
import AddTripModal from '../components/AddTripModal';
import '../styles/TripsPage.css';

const TripsPage = ({ t, setCurrentPage }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);

    useEffect(() => {
        fetchTrips();
    }, [searchTerm]);

    const fetchTrips = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            
            const response = await tripsAPI.getAll(params);
            if (response.status === 'success') {
                setTrips(response.data.trips || []);
            }
        } catch (err) {
            setError(err.message || 'Failed to load trips');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this trip?')) {
            return;
        }

        try {
            await tripsAPI.delete(id);
            fetchTrips();
        } catch (err) {
            alert('Failed to delete trip: ' + err.message);
        }
    };

    const handleEdit = (trip) => {
        setEditingTrip(trip);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingTrip(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingTrip(null);
    };

    const handleModalSuccess = () => {
        fetchTrips();
        handleModalClose();
    };

    const handleToggleStatus = async (trip) => {
        try {
            await tripsAPI.toggleStatus(trip._id);
            fetchTrips();
        } catch (err) {
            alert('Failed to toggle trip status: ' + err.message);
        }
    };

    const handleDownloadExcel = () => {
        const csvRows = [];
        csvRows.push(['Trip No.', 'Trip Name', 'Trip Status', 'Date', 'Currency', 'Available', 'Remaining', 'Booked', 'Adults', 'Children', 'Infant', 'File']);
        
        trips.forEach((trip) => {
            csvRows.push([
                trip.tripNo || '-',
                trip.tripName || '-',
                trip.tripStatus || '-',
                formatDate(trip.date),
                trip.currency || '-',
                trip.available || 0,
                trip.remaining || 0,
                trip.booked || 0,
                trip.adults || 0,
                trip.children || 0,
                trip.infant || 0,
                trip.file || '-'
            ]);
        });

        const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `trips_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const formatValue = (value) => {
        return value && value !== 0 ? value : '-';
    };

    const filteredTrips = trips.filter(trip => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            (trip.tripName || '').toLowerCase().includes(search) ||
            (trip.file || '').toLowerCase().includes(search) ||
            (trip.tripNo || '').toString().includes(search)
        );
    });

    if (loading && trips.length === 0) {
        return (
            <div className="trips-page">
                <div className="loading-message">Loading trips...</div>
            </div>
        );
    }

    return (
        <div className="trips-page">
            {/* Header */}
            <div className="trips-header">
                <h1 className="page-title">Trips</h1>
                <div className="header-actions">
                    <button className="btn-search-header" onClick={() => document.querySelector('.search-input-trips')?.focus()}>
                        <span className="btn-icon">🔍</span>
                        Q Search
                    </button>
                    <button className="btn-add-trip" onClick={handleAddNew}>
                        <span className="btn-icon">➕</span>
                        Add Trip
                    </button>
                    <button className="btn-download-excel" onClick={handleDownloadExcel}>
                        <span className="btn-icon">📊</span>
                        Download Excel
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* Search Input */}
            <div className="search-container-trips">
                <input
                    type="text"
                    className="search-input-trips"
                    placeholder="Search trips..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Table Section */}
            <div className="trips-table-container">
                <table className="trips-table">
                    <thead>
                        <tr>
                            <th>
                                Trip No. <span className="sort-arrow">⌄</span>
                            </th>
                            <th>Trip Name</th>
                            <th>Trip Status</th>
                            <th>Date</th>
                            <th>Currency</th>
                            <th>Available</th>
                            <th>Remaining</th>
                            <th>Booked</th>
                            <th>Adults</th>
                            <th>Children</th>
                            <th>Infant</th>
                            <th>File</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrips.length === 0 ? (
                            <tr>
                                <td colSpan="13" className="no-data">
                                    {searchTerm ? 'No trips found matching your search' : 'No trips yet. Click "Add Trip" to create your first trip.'}
                                </td>
                            </tr>
                        ) : (
                            filteredTrips.map((trip) => (
                                <tr key={trip._id}>
                                    <td>{trip.tripNo || '-'}</td>
                                    <td>{trip.tripName || '-'}</td>
                                    <td>
                                        <span 
                                            className={`status-badge ${trip.tripStatus === 'Active' ? 'status-active' : 'status-inactive'}`}
                                            onClick={() => handleToggleStatus(trip)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {trip.tripStatus || 'Active'}
                                        </span>
                                    </td>
                                    <td>{formatDate(trip.date)}</td>
                                    <td>{trip.currency || '-'}</td>
                                    <td>{trip.available || 0}</td>
                                    <td className="remaining-cell">{trip.remaining || 0}</td>
                                    <td>{formatValue(trip.booked)}</td>
                                    <td>{formatValue(trip.adults)}</td>
                                    <td>{formatValue(trip.children)}</td>
                                    <td>{formatValue(trip.infant)}</td>
                                    <td>{trip.file || '-'}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn-icon btn-edit"
                                            onClick={() => handleEdit(trip)}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-icon btn-delete"
                                            onClick={() => handleDelete(trip._id)}
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
            <div className="trips-footer">
                <div className="total-count">
                    Result: <span className="count-highlight">{filteredTrips.length}</span> of <span className="count-highlight">{trips.length}</span> Total
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <AddTripModal
                    isOpen={showModal}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                    trip={editingTrip}
                />
            )}
        </div>
    );
};

export default TripsPage;

