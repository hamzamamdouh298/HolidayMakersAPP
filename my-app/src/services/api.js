// API Base URL
const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('ehm_token');

// Generic API call handler
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ========== AUTH API ==========
export const authAPI = {
  login: async (username, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  logout: async () => {
    return apiCall('/auth/logout', { method: 'POST' });
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },

  updatePassword: async (currentPassword, newPassword) => {
    return apiCall('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  updateProfile: async (profileData) => {
    return apiCall('/auth/updateprofile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }
};

// ========== USERS API ==========
export const usersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/users${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/users/${id}`);
  },

  create: async (userData) => {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  update: async (id, userData) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  delete: async (id) => {
    return apiCall(`/users/${id}`, {
      method: 'DELETE'
    });
  },

  bulkDelete: async (userIds) => {
    return apiCall('/users/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ userIds })
    });
  }
};

// ========== ROLES API ==========
export const rolesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/roles${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/roles/${id}`);
  },

  create: async (roleData) => {
    return apiCall('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData)
    });
  },

  update: async (id, roleData) => {
    return apiCall(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData)
    });
  },

  delete: async (id) => {
    return apiCall(`/roles/${id}`, {
      method: 'DELETE'
    });
  }
};

// ========== RESERVATIONS API ==========
export const reservationsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/reservations${queryString ? `?${queryString}` : ''}`);
  },

  getStats: async () => {
    return apiCall('/reservations/stats');
  },

  getById: async (id) => {
    return apiCall(`/reservations/${id}`);
  },

  create: async (reservationData) => {
    return apiCall('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  },

  update: async (id, reservationData) => {
    return apiCall(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservationData)
    });
  },

  delete: async (id) => {
    return apiCall(`/reservations/${id}`, {
      method: 'DELETE'
    });
  },

  duplicate: async (id) => {
    return apiCall(`/reservations/${id}/duplicate`, {
      method: 'POST'
    });
  },

  bulkDelete: async (reservationIds) => {
    return apiCall('/reservations/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ reservationIds })
    });
  }
};

// ========== STATISTICS API ==========
export const statisticsAPI = {
  getGeneral: async () => {
    return apiCall('/statistics');
  },

  getReservationStats: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/statistics/reservations${queryString ? `?${queryString}` : ''}`);
  },

  getUserPerformance: async (userId) => {
    return apiCall(`/statistics/user/${userId || ''}`);
  }
};

// ========== CUSTOMERS API ==========
export const customersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/customers${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/customers/${id}`);
  },

  create: async (customerData) => {
    return apiCall('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    });
  },

  update: async (id, customerData) => {
    return apiCall(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData)
    });
  },

  delete: async (id) => {
    return apiCall(`/customers/${id}`, {
      method: 'DELETE'
    });
  },

  search: async (query) => {
    return apiCall(`/customers/search?query=${encodeURIComponent(query)}`);
  }
};

// ========== HOTELS API ==========
export const hotelsAPI = {
  getAll: async () => {
    return apiCall('/hotels');
  },

  getById: async (id) => {
    return apiCall(`/hotels/${id}`);
  },

  create: async (hotelData) => {
    return apiCall('/hotels', {
      method: 'POST',
      body: JSON.stringify(hotelData)
    });
  },

  update: async (id, hotelData) => {
    return apiCall(`/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hotelData)
    });
  },

  delete: async (id) => {
    return apiCall(`/hotels/${id}`, {
      method: 'DELETE'
    });
  }
};

// ========== HOTEL CONTRACTS API ==========
export const hotelContractsAPI = {
  getAll: async () => {
    return apiCall('/hotel-contracts');
  },

  getById: async (id) => {
    return apiCall(`/hotel-contracts/${id}`);
  },

  create: async (contractData) => {
    return apiCall('/hotel-contracts', {
      method: 'POST',
      body: JSON.stringify(contractData)
    });
  },

  update: async (id, contractData) => {
    return apiCall(`/hotel-contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contractData)
    });
  },

  delete: async (id) => {
    return apiCall(`/hotel-contracts/${id}`, {
      method: 'DELETE'
    });
  }
};

// ========== PACKAGES API ==========
export const packagesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/packages${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/packages/${id}`);
  },

  create: async (packageData) => {
    return apiCall('/packages', {
      method: 'POST',
      body: JSON.stringify(packageData)
    });
  },

  update: async (id, packageData) => {
    return apiCall(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(packageData)
    });
  },

  delete: async (id) => {
    return apiCall(`/packages/${id}`, {
      method: 'DELETE'
    });
  }
};

// ========== ITINERARIES API ==========
export const itinerariesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/itineraries${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/itineraries/${id}`);
  },

  create: async (itineraryData) => {
    return apiCall('/itineraries', {
      method: 'POST',
      body: JSON.stringify(itineraryData)
    });
  },

  update: async (id, itineraryData) => {
    return apiCall(`/itineraries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itineraryData)
    });
  },

  delete: async (id) => {
    return apiCall(`/itineraries/${id}`, {
      method: 'DELETE'
    });
  }
};

// ========== TOUR GUIDE SCHEDULES API ==========
export const tourGuideSchedulesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/tour-guide-schedules${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/tour-guide-schedules/${id}`);
  },

  create: async (scheduleData) => {
    return apiCall('/tour-guide-schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData)
    });
  },

  update: async (id, scheduleData) => {
    return apiCall(`/tour-guide-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData)
    });
  },

  delete: async (id) => {
    return apiCall(`/tour-guide-schedules/${id}`, {
      method: 'DELETE'
    });
  }
};
export const airportTransfersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/airport-transfers${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/airport-transfers/${id}`);
  },

  create: async (transferData) => {
    return apiCall('/airport-transfers', {
      method: 'POST',
      body: JSON.stringify(transferData)
    });
  },

  update: async (id, transferData) => {
    return apiCall(`/airport-transfers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transferData)
    });
  },

  delete: async (id) => {
    return apiCall(`/airport-transfers/${id}`, {
      method: 'DELETE'
    });
  }
};

// ========== VISAS API ==========
export const visasAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/visas${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/visas/${id}`);
  },

  create: async (visaData) => {
    return apiCall('/visas', {
      method: 'POST',
      body: JSON.stringify(visaData)
    });
  },

  update: async (id, visaData) => {
    return apiCall(`/visas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(visaData)
    });
  },

  delete: async (id) => {
    return apiCall(`/visas/${id}`, {
      method: 'DELETE'
    });
  },

  getTypes: async () => {
    return apiCall('/visas/types');
  }
};

// ========== BALLOONS API ==========
export const balloonsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/balloons${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/balloons/${id}`);
  },

  create: async (balloonData) => {
    return apiCall('/balloons', {
      method: 'POST',
      body: JSON.stringify(balloonData)
    });
  },

  update: async (id, balloonData) => {
    return apiCall(`/balloons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(balloonData)
    });
  },

  delete: async (id) => {
    return apiCall(`/balloons/${id}`, {
      method: 'DELETE'
    });
  },

  getCountReport: async () => {
    return apiCall('/balloons/reports/count');
  },

  getProfitReport: async () => {
    return apiCall('/balloons/reports/profit');
  },

  getSupplierReport: async () => {
    return apiCall('/balloons/reports/supplier');
  }
};

// ========== TRIPS API ==========
export const tripsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/trips${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/trips/${id}`);
  },

  create: async (tripData) => {
    return apiCall('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData)
    });
  },

  update: async (id, tripData) => {
    return apiCall(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData)
    });
  },

  delete: async (id) => {
    return apiCall(`/trips/${id}`, {
      method: 'DELETE'
    });
  },

  toggleStatus: async (id) => {
    return apiCall(`/trips/${id}/toggle-status`, {
      method: 'PUT'
    });
  }
};

// ========== BAGS API ==========
export const bagsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/bags${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/bags/${id}`);
  },

  create: async (bagData) => {
    return apiCall('/bags', {
      method: 'POST',
      body: JSON.stringify(bagData)
    });
  },

  update: async (id, bagData) => {
    return apiCall(`/bags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bagData)
    });
  },

  delete: async (id) => {
    return apiCall(`/bags/${id}`, {
      method: 'DELETE'
    });
  },

  toggleEntryId: async (id) => {
    return apiCall(`/bags/${id}/toggle-entry`, {
      method: 'PUT'
    });
  }
};

// ========== BAG PRICES API ==========
export const bagPricesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/bag-prices${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/bag-prices/${id}`);
  },

  create: async (bagPriceData) => {
    return apiCall('/bag-prices', {
      method: 'POST',
      body: JSON.stringify(bagPriceData)
    });
  },

  update: async (id, bagPriceData) => {
    return apiCall(`/bag-prices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bagPriceData)
    });
  },

  delete: async (id) => {
    return apiCall(`/bag-prices/${id}`, {
      method: 'DELETE'
    });
  }
};

// ========== ACCOUNTING API ==========
export const accountingAPI = {
  getFinancialAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/accounting/analytics${queryString ? `?${queryString}` : ''}`);
  },

  getPerformanceOverview: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/accounting/performance${queryString ? `?${queryString}` : ''}`);
  },

  getReceiptPayment: async () => {
    return apiCall('/accounting/receipt-payment');
  },

  getBanks: async () => {
    return apiCall('/accounting/banks');
  },

  getAccounts: async () => {
    return apiCall('/accounting/accounts');
  },

  getSafes: async () => {
    return apiCall('/accounting/safes');
  },

  getBanksList: async () => {
    return apiCall('/accounting/banks-list');
  },

  getTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/accounting/transactions${queryString ? `?${queryString}` : ''}`);
  }
};

export default {
  authAPI,
  usersAPI,
  rolesAPI,
  reservationsAPI,
  statisticsAPI,
  customersAPI,
  hotelsAPI,
  hotelContractsAPI,
  packagesAPI,
  itinerariesAPI,
  tourGuideSchedulesAPI,
  airportTransfersAPI,
  visasAPI,
  balloonsAPI,
  tripsAPI,
  bagsAPI,
  bagPricesAPI,
  accountingAPI
};

