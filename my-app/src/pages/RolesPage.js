import React from 'react';

const RolesPage = ({
  t,
  roles,
  searchTerm,
  handleSearch,
  setShowAddModal,
  toggleSort,
  sortOrder,
  filteredAndSortedRoles,
  itemsPerPage,
  setItemsPerPage,
  deleteRole,
  exportToExcel,
  refreshPermissions,
  showAddModal,
  setShowAddModal: closeModal,
  newRoleName,
  setNewRoleName,
  addRole
}) => {
  return (
    <div className="roles-page">
      <div className="roles-header">
        <h1 className="roles-title">{t.rolesPage}</h1>
        <button className="refresh-permissions-btn" onClick={refreshPermissions}>
          <span className="btn-icon">🔄</span>
          {t.refreshPermissions}
        </button>
      </div>

      <div className="roles-actions">
        <div className="roles-actions-left">
          <div className="search-input-container">
            <button className="search-btn">
              <span className="btn-icon">🔍</span>
            </button>
            <input 
              type="text" 
              className="search-input" 
              placeholder={t.search + "..."}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <span className="btn-icon">➕</span>
            {t.add}
          </button>
        </div>
        <button className="export-btn" onClick={exportToExcel}>
          <span className="btn-icon">📥</span>
          {t.exportExcel}
        </button>
      </div>

      <div className="roles-table-container">
        <table className="roles-table">
          <thead>
            <tr>
              <th className="sortable" onClick={toggleSort}>
                {t.id}
                <span className="sort-icon">{sortOrder === 'asc' ? '▲' : '▼'}</span>
              </th>
              <th>{t.name}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRoles.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="3" className="empty-message">
                  {searchTerm ? 'No roles found' : 'No roles added yet'}
                </td>
              </tr>
            ) : (
              filteredAndSortedRoles.slice(0, itemsPerPage).map(role => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.name}</td>
                  <td>
                    <button 
                      className="delete-role-btn" 
                      onClick={() => deleteRole(role.id)}
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

      <div className="roles-footer">
        <span className="result-text">
          {t.result}: {filteredAndSortedRoles.length} {t.of} {roles.length} {t.total}
        </span>
        <div className="pagination">
          <button className="pagination-refresh" onClick={() => handleSearch({ target: { value: '' } })}>🔄</button>
          <select 
            className="pagination-select"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => closeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t.add} {t.rolesPage}</h2>
              <button className="modal-close" onClick={() => closeModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="modal-label">{t.name}:</label>
              <input 
                type="text" 
                className="modal-input"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRole()}
                placeholder="Enter role name..."
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => closeModal(false)}>
                Cancel
              </button>
              <button className="modal-save" onClick={addRole}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;

