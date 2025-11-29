import React from 'react';
import SearchModal from '../components/SearchModal';
import AddUserModal from '../components/AddUserModal';

const UsersPage = ({
  t,
  users,
  filteredUsers,
  setShowSearchModal,
  setShowAddUserModal,
  exportUsersToExcel,
  toggleUserEnabled,
  deleteUser,
  showSearchModal,
  searchFilters,
  handleSearchFilterChange,
  clearSearchFilters,
  performSearch,
  roles,
  showAddUserModal,
  newUser,
  handleNewUserChange,
  validationErrors,
  setValidationErrors,
  showPassword,
  setShowPassword,
  clearNewUser,
  addUser
}) => {
  return (
    <div className="users-page">
      <div className="users-header">
        <h1 className="users-title">{t.usersPage}</h1>
      </div>

      <div className="users-actions">
        <div className="users-actions-left">
          <button className="search-btn-standalone" onClick={() => setShowSearchModal(true)}>
            <span className="btn-icon">🔍</span>
            {t.search}
          </button>
          <button className="add-btn" onClick={() => setShowAddUserModal(true)}>
            <span className="btn-icon">➕</span>
            {t.add}
          </button>
        </div>
        <button className="export-btn" onClick={exportUsersToExcel}>
          <span className="btn-icon">📥</span>
          {t.exportExcel}
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th className="sortable">
                {t.id}
                <span className="sort-icon">⌄</span>
              </th>
              <th>{t.name}</th>
              <th>{t.enabled}</th>
              <th>{t.role}</th>
              <th>{t.branch}</th>
              <th>{t.department}</th>
              <th>{t.authType}</th>
              <th>{t.code}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="9" className="empty-message">
                  {users.length === 0 ? 'No users added yet' : 'No users match the search criteria'}
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.userName}</td>
                  <td>
                    <button 
                      className={`enabled-toggle ${user.enabled ? 'enabled-yes' : 'enabled-no'}`}
                      onClick={() => toggleUserEnabled(user.id)}
                    >
                      {user.enabled ? '✓' : '✗'}
                    </button>
                  </td>
                  <td>{user.role}</td>
                  <td>{user.branch}</td>
                  <td>{user.department}</td>
                  <td>Password</td>
                  <td>{user.code}</td>
                  <td>
                    <button 
                      className="delete-role-btn" 
                      onClick={() => deleteUser(user.id)}
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

      <div className="users-footer">
        <span className="result-text">
          {t.result}: {filteredUsers.length} {t.of} {users.length} {t.total}
        </span>
        <div className="pagination">
          <button className="pagination-refresh">🔄</button>
          <select className="pagination-select">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <SearchModal
          t={t}
          searchFilters={searchFilters}
          handleSearchFilterChange={handleSearchFilterChange}
          clearSearchFilters={clearSearchFilters}
          performSearch={performSearch}
          setShowSearchModal={setShowSearchModal}
          roles={roles}
        />
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          t={t}
          newUser={newUser}
          handleNewUserChange={handleNewUserChange}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          clearNewUser={clearNewUser}
          addUser={addUser}
          setShowAddUserModal={setShowAddUserModal}
          roles={roles}
        />
      )}
    </div>
  );
};

export default UsersPage;

