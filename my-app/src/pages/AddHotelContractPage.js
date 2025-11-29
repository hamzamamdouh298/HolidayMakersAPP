import React, { useState, useEffect } from 'react';
import { hotelContractsAPI, hotelsAPI } from '../services/api';
import '../styles/AddHotelContractPage.css';

const AddHotelContractPage = ({ t, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
    hotel: '',
    season: '',
    periods: []
  });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNewHotelModal, setShowNewHotelModal] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newHotel, setNewHotel] = useState({ name: '' });
  const [newGroup, setNewGroup] = useState({
    groupName: '',
    startDate: '',
    endDate: '',
    roomsCount: 0,
    commitment: 0,
    allotment: ''
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await hotelsAPI.getAll();
      if (response.status === 'success') {
        setHotels(response.data.hotels || []);
      }
    } catch (err) {
      console.error('Failed to load hotels:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPeriod = () => {
    setShowAddGroupModal(true);
  };

  const handleSaveGroup = () => {
    if (!newGroup.groupName || !newGroup.startDate || !newGroup.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    setFormData(prev => ({
      ...prev,
      periods: [...prev.periods, { ...newGroup }]
    }));

    setNewGroup({
      groupName: '',
      startDate: '',
      endDate: '',
      roomsCount: 0,
      commitment: 0,
      allotment: ''
    });
    setShowAddGroupModal(false);
  };

  const handleRemovePeriod = (index) => {
    setFormData(prev => ({
      ...prev,
      periods: prev.periods.filter((_, i) => i !== index)
    }));
  };

  const handleClear = () => {
    setFormData({
      name: '',
      notes: '',
      hotel: '',
      season: '',
      periods: []
    });
    setError('');
    setSuccess('');
  };

  const handleCreateHotel = async () => {
    if (!newHotel.name.trim()) {
      alert('Hotel name is required');
      return;
    }

    try {
      const response = await hotelsAPI.create({ name: newHotel.name });
      if (response.status === 'success') {
        await fetchHotels();
        setFormData(prev => ({ ...prev, hotel: response.data.hotel._id }));
        setShowNewHotelModal(false);
        setNewHotel({ name: '' });
      }
    } catch (err) {
      alert('Failed to create hotel: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Contract name is required');
      return;
    }

    if (!formData.hotel) {
      setError('Hotel is required');
      return;
    }

    // Format periods - map startDate/endDate to from/to for backend
    const formattedPeriods = formData.periods.map(period => ({
      groupName: period.groupName,
      from: period.startDate ? new Date(period.startDate) : null,
      to: period.endDate ? new Date(period.endDate) : null,
      roomsCount: period.roomsCount || 0,
      commitment: period.commitment || 0,
      allotment: period.allotment || ''
    }));

    setLoading(true);

    try {
      const contractData = {
        name: formData.name,
        hotel: formData.hotel,
        season: formData.season,
        notes: formData.notes,
        periods: formattedPeriods
      };

      const response = await hotelContractsAPI.create(contractData);

      if (response.status === 'success') {
        setSuccess('Hotel contract added successfully!');
        handleClear();

        if (onSuccess) {
          onSuccess(response.data.contract);
        }

        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to add hotel contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-hotel-contract-page">
      <div className="add-hotel-contract-header">
        <div className="breadcrumbs">
          <span>Home</span>
          <span className="separator">/</span>
          <span>Hotel Contracts</span>
          <span className="separator">/</span>
          <span>Add Hotel Contract</span>
        </div>
        <h1 className="page-title">Add Hotel Contract</h1>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="hotel-contract-form">
        <div className="form-section">
          <h3 className="section-title">basic information</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Hotel Name</label>
              <div className="hotel-select-wrapper">
                <select
                  name="hotel"
                  value={formData.hotel}
                  onChange={handleChange}
                  required
                >
                  <option value="">hotel name</option>
                  {hotels.map(hotel => (
                    <option key={hotel._id} value={hotel._id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="new-hotel-btn"
                  onClick={() => setShowNewHotelModal(true)}
                >
                  New
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Season</label>
              <select
                name="season"
                value={formData.season}
                onChange={handleChange}
              >
                <option value="">Select Season</option>
                <option value="الصيف">الصيف</option>
                <option value="عمره">عمره</option>
                <option value="حج">حج</option>
                <option value="Winter 23-24">Winter 23-24</option>
                <option value="Summer 24">Summer 24</option>
                <option value="Winter 24-25">Winter 24-25</option>
                <option value="Summer 2023">Summer 2023</option>
                <option value="الربيع">الربيع</option>
                <option value="الخريف">الخريف</option>
                <option value="حج وعمره">حج وعمره</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="periods-header">
            <h3 className="section-title">Periods Details</h3>
            <button
              type="button"
              className="add-group-btn"
              onClick={handleAddPeriod}
            >
              ➕ Add Group
            </button>
          </div>

          <div className="periods-table-container">
            <table className="periods-table">
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.periods.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-periods">
                      No periods added. Click "Add Group" to add a period.
                    </td>
                  </tr>
                ) : (
                  formData.periods.map((period, index) => (
                    <tr key={index}>
                      <td>{period.groupName}</td>
                      <td>{period.startDate}</td>
                      <td>{period.endDate}</td>
                      <td>
                        <button
                          type="button"
                          className="remove-period-btn"
                          onClick={() => handleRemovePeriod(index)}
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

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Contract'}
          </button>
        </div>
      </form>

      {/* New Hotel Modal */}
      {showNewHotelModal && (
        <div className="modal-overlay" onClick={() => setShowNewHotelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Hotel</h2>
              <button className="modal-close" onClick={() => setShowNewHotelModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Hotel Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={newHotel.name}
                  onChange={(e) => setNewHotel({ name: e.target.value })}
                  placeholder="Enter hotel name"
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNewHotelModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateHotel}>
                Add Hotel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      {showAddGroupModal && (
        <div className="modal-overlay" onClick={() => setShowAddGroupModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Group</h2>
              <button className="modal-close" onClick={() => setShowAddGroupModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  value={newGroup.groupName}
                  onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })}
                  placeholder="Group Name"
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={newGroup.startDate}
                  onChange={(e) => setNewGroup({ ...newGroup, startDate: e.target.value })}
                  placeholder="dd-mm-yyyy"
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={newGroup.endDate}
                  onChange={(e) => setNewGroup({ ...newGroup, endDate: e.target.value })}
                  placeholder="dd-mm-yyyy"
                />
              </div>
              <div className="form-group">
                <label>No of rooms</label>
                <input
                  type="number"
                  value={newGroup.roomsCount}
                  onChange={(e) => setNewGroup({ ...newGroup, roomsCount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Commitment</label>
                <input
                  type="number"
                  value={newGroup.commitment}
                  onChange={(e) => setNewGroup({ ...newGroup, commitment: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Allotment</label>
                <input
                  type="text"
                  value={newGroup.allotment}
                  onChange={(e) => setNewGroup({ ...newGroup, allotment: e.target.value })}
                  placeholder="Allotment"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddGroupModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handleSaveGroup}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddHotelContractPage;

