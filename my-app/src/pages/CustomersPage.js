import React, { useState, useEffect } from 'react';
import '../styles/CustomersPage.css';
import { customersAPI } from '../services/api';

const CustomersPage = ({ t, setCurrentPage }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await customersAPI.getAll();
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(customer => {
    const search = searchTerm.toLowerCase();
    return (
      customer.customerName?.toLowerCase().includes(search) ||
      customer.customerCode?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.telephone?.number?.includes(search) ||
      customer.nationalId?.toLowerCase().includes(search)
    );
  });

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCustomers.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedCustomers.length} customer(s)?`)) {
      return;
    }

    try {
      for (const customerId of selectedCustomers) {
        await customersAPI.delete(customerId);
      }
      
      setSelectedCustomers([]);
      fetchCustomers();
    } catch (err) {
      alert('Failed to delete customers: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="customers-page">
        <div className="loading-message">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="customers-page">
      <div className="customers-header">
        <h2>Customer List</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setCurrentPage && setCurrentPage('addCustomer')}
        >
          ➕ Add New Customer
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="customers-content">
        <div className="customers-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search by name, code, email, phone, or national ID..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {selectedCustomers.length > 0 && (
            <div className="bulk-actions">
              <span>{selectedCustomers.length} selected</span>
              <button 
                className="btn btn-danger btn-sm"
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>

        <div className="customers-table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Customer Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>City</th>
                <th>National ID</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="no-data">
                    {searchTerm ? 'No customers found matching your search' : 'No customers yet. Click "Add New Customer" to get started.'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer._id)}
                        onChange={() => handleSelectCustomer(customer._id)}
                      />
                    </td>
                    <td className="customer-code">{customer.customerCode || 'N/A'}</td>
                    <td className="customer-name">{customer.customerName}</td>
                    <td>{customer.customerType || 'N/A'}</td>
                    <td>{customer.email || 'N/A'}</td>
                    <td>
                      {customer.telephone?.number 
                        ? `${customer.telephone.countryCode || ''} ${customer.telephone.number}`
                        : 'N/A'}
                    </td>
                    <td>{customer.country || 'N/A'}</td>
                    <td>{customer.city || 'N/A'}</td>
                    <td>{customer.nationalId || 'N/A'}</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button 
                        className="btn-icon btn-view"
                        title="View Details"
                        onClick={() => {/* TODO: Implement view details */}}
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-icon btn-edit"
                        title="Edit Customer"
                        onClick={() => {/* TODO: Implement edit */}}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon btn-delete"
                        title="Delete Customer"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this customer?')) {
                            try {
                              await customersAPI.delete(customer._id);
                              fetchCustomers();
                            } catch (err) {
                              alert('Failed to delete customer: ' + err.message);
                            }
                          }
                        }}
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

        <div className="customers-footer">
          <div className="total-count">
            Total Customers: {filteredCustomers.length}
            {searchTerm && ` (filtered from ${customers.length})`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;

