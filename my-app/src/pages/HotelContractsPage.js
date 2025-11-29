import React, { useState, useEffect } from 'react';
import { hotelContractsAPI } from '../services/api';
import '../styles/HotelContractsPage.css';

const HotelContractsPage = ({ t, setCurrentPage }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await hotelContractsAPI.getAll();
      if (response.status === 'success') {
        setContracts(response.data.contracts || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load hotel contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contract?')) {
      return;
    }

    try {
      await hotelContractsAPI.delete(id);
      fetchContracts();
    } catch (err) {
      alert('Failed to delete contract: ' + err.message);
    }
  };

  const handleEdit = (contract) => {
    // TODO: Implement edit functionality - navigate to edit page
    console.log('Edit contract:', contract);
    alert('Edit functionality coming soon!');
  };

  const handleDownloadExcel = (contract) => {
    // Convert contract to CSV format for Excel compatibility
    const csvRows = [];

    // Add header
    csvRows.push(['Hotel Contract Details']);
    csvRows.push(['']);
    csvRows.push(['Field', 'Value']);
    csvRows.push(['ID', contract._id || 'N/A']);
    csvRows.push(['Code', contract.code || 'N/A']);
    csvRows.push(['Name', contract.name || 'N/A']);
    csvRows.push(['Hotel', contract.hotel?.name || 'N/A']);
    csvRows.push(['Season', contract.season || 'N/A']);
    csvRows.push(['Notes', contract.notes || 'N/A']);
    csvRows.push(['']);

    // Add periods if they exist
    if (contract.periods && contract.periods.length > 0) {
      csvRows.push(['Periods']);
      csvRows.push(['Group Name', 'From', 'To', 'Rooms', 'Commitment', 'Allotment']);
      contract.periods.forEach(period => {
        csvRows.push([
          period.groupName || 'N/A',
          period.from ? new Date(period.from).toLocaleDateString() : 'N/A',
          period.to ? new Date(period.to).toLocaleDateString() : 'N/A',
          period.roomsCount || 0,
          period.commitment || 0,
          period.allotment || 'N/A'
        ]);
      });
    }

    // Convert to CSV string
    const csvContent = csvRows.map(row =>
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `hotel_contract_${contract.code || contract._id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredContracts = contracts.filter(contract => {
    const search = searchTerm.toLowerCase();
    return (
      contract.name?.toLowerCase().includes(search) ||
      contract.code?.toString().includes(search) ||
      contract.hotel?.name?.toLowerCase().includes(search) ||
      contract.season?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="hotel-contracts-page">
        <div className="loading-message">Loading hotel contracts...</div>
      </div>
    );
  }

  return (
    <div className="hotel-contracts-page">
      <div className="hotel-contracts-header">
        <div className="breadcrumbs">
          <span>Home</span>
          <span className="separator">/</span>
          <span>Hotel Contracts</span>
        </div>
        <h1 className="page-title">Hotels Contracts</h1>
      </div>

      <div className="hotel-contracts-actions">
        <button
          className="search-btn"
          onClick={() => {/* TODO: Implement search modal */ }}
        >
          <span className="btn-icon">🔍</span>
          Search
        </button>
        <button
          className="add-contract-btn"
          onClick={() => setCurrentPage && setCurrentPage('addHotelContract')}
        >
          <span className="btn-icon">➕</span>
          Add Contract
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="hotel-contracts-table-container">
        <table className="hotel-contracts-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Hotel</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {searchTerm ? 'No contracts found matching your search' : 'No hotel contracts yet. Click "Add Contract" to get started.'}
                </td>
              </tr>
            ) : (
              filteredContracts.map((contract, index) => (
                <tr key={contract._id}>
                  <td>{contracts.length - index}</td>
                  <td className="contract-code">{contract.code || 'N/A'}</td>
                  <td className="contract-name">{contract.name}</td>
                  <td>{contract.hotel?.name || 'N/A'}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon btn-edit"
                      title="Edit Contract"
                      onClick={() => handleEdit(contract)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      title="Delete Contract"
                      onClick={() => handleDelete(contract._id)}
                    >
                      🗑️
                    </button>
                    <button
                      className="btn-icon btn-download"
                      title="Download as Excel"
                      onClick={() => handleDownloadExcel(contract)}
                    >
                      📥
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="hotel-contracts-footer">
        <div className="total-count">
          {filteredContracts.length} total
        </div>
      </div>
    </div>
  );
};

export default HotelContractsPage;

