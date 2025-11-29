import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import LoginPage from './pages/LoginPage';
import ReservationsPage from './pages/ReservationsPage';
import NewReservationPage from './pages/NewReservationPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import UpdatesPage from './pages/UpdatesPage';
import StatisticsPage from './pages/StatisticsPage';
import SuppliersPage from './pages/SuppliersPage';
import AddSupplierPage from './pages/AddSupplierPage';
import CustomersPage from './pages/CustomersPage';
import AddCustomerPage from './pages/AddCustomerPage';
import HotelContractsPage from './pages/HotelContractsPage';
import AddHotelContractPage from './pages/AddHotelContractPage';
import PackagesPage from './pages/PackagesPage';
import ItineraryPage from './pages/ItineraryPage';
import TourGuideSchedulePage from './pages/TourGuideSchedulePage';
import AddAirportTransferPage from './pages/AddAirportTransferPage';
import AirportTransfersPage from './pages/AirportTransfersPage';
import VisasPage from './pages/VisasPage';
import BalloonPage from './pages/BalloonPage';
import TripsPage from './pages/TripsPage';
import BagsPage from './pages/BagsPage';
import BagPricesPage from './pages/BagPricesPage';
import AccountingPage from './pages/AccountingPage';
import { usersAPI, rolesAPI, reservationsAPI } from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if user is logged in from localStorage
    return localStorage.getItem('ehm_is_logged_in') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    // Restore user data from localStorage
    const savedUser = localStorage.getItem('ehm_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [reservationsOpen, setReservationsOpen] = useState(false);
  const [airportTransfersOpen, setAirportTransfersOpen] = useState(false);
  const [visasOpen, setVisasOpen] = useState(false);
  const [balloonsOpen, setBalloonsOpen] = useState(false);
  const [hajjUmrahOpen, setHajjUmrahOpen] = useState(false);
  const [bagsOpen, setBagsOpen] = useState(false);
  const [bagPricesOpen, setBagPricesOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [accountingOpen, setAccountingOpen] = useState(false);
  const [customersOpen, setCustomersOpen] = useState(false);
  const [suppliersOpen, setSuppliersOpen] = useState(false);
  const [contractsOpen, setContractsOpen] = useState(false);
  const [managementsOpen, setManagementsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [allBookingsOpen, setAllBookingsOpen] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Debug: Log when currentPage changes
  useEffect(() => {
    console.log('🔵 currentPage state changed to:', currentPage);
  }, [currentPage]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Restore dark mode preference from localStorage
    return localStorage.getItem('ehm_dark_mode') === 'true';
  });

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'reservation',
      icon: '🎉',
      titleKey: 'newReservation',
      time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isRead: false
    },
    {
      id: 2,
      type: 'payment',
      icon: '💰',
      titleKey: 'paymentReceived',
      time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      isRead: false
    },
    {
      id: 3,
      type: 'customer',
      icon: '👤',
      titleKey: 'customerUpdate',
      time: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      isRead: false
    },
    {
      id: 4,
      type: 'system',
      icon: '⚙️',
      titleKey: 'systemUpdate',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: true
    }
  ]);

  // Roles page state
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  // Reservations state (shared between ReservationsPage and NewReservationPage)
  const [reservations, setReservations] = useState([]);

  // Suppliers state
  const [suppliers, setSuppliers] = useState([]);

  // Users page state
  const [users, setUsers] = useState(() => {
    // Restore users from localStorage
    const savedUsers = localStorage.getItem('ehm_users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    userName: '',
    branch: 'All',
    department: '',
    role: '',
    email: '',
    enabled: 'All'
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    userName: '',
    password: '',
    branch: 'Cairo',
    department: 'Sales',
    role: 'Admin',
    email: '',
    employeeRole: 'Manager',
    isEmployee: false,
    enabled: true,
    code: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Context menu state for users
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    user: null
  });
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('ehm_dark_mode', newMode.toString());
  };

  const handleLogin = (loginData) => {
    // Check if loginData comes from backend API (has user and token)
    if (loginData.user && loginData.token) {
      // Backend API login response
      const backendUser = loginData.user;

      // Map backend user to app user format
      const mappedUser = {
        userName: backendUser.fullName || backendUser.username,
        username: backendUser.username,
        role: backendUser.role?.displayName || backendUser.role?.name || 'User',
        email: backendUser.email,
        branch: backendUser.branch,
        department: backendUser.department,
        _id: backendUser._id,
        permissions: backendUser.role?.permissions || {}
      };

      setCurrentUser(mappedUser);
      setIsLoggedIn(true);

      // Save to localStorage
      localStorage.setItem('ehm_is_logged_in', 'true');
      localStorage.setItem('ehm_current_user', JSON.stringify(mappedUser));
      localStorage.setItem('ehm_token', loginData.token);

      return true;
    }

    // Fallback for old format (shouldn't happen with backend)
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    // Clear localStorage
    localStorage.removeItem('ehm_is_logged_in');
    localStorage.removeItem('ehm_current_user');
    localStorage.removeItem('ehm_token');
    localStorage.removeItem('ehm_user');
  };

  // Handle profile update
  const handleUpdateProfile = (updatedUser) => {
    // Update current user state
    setCurrentUser(updatedUser);
    // Update localStorage
    localStorage.setItem('ehm_user', JSON.stringify(updatedUser));
    localStorage.setItem('ehm_current_user', JSON.stringify(updatedUser));
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      if (response.status === 'success') {
        // Map backend users to app format
        const mappedUsers = response.data.users.map((user, index) => ({
          id: index + 1,
          _id: user._id,
          userName: user.fullName || user.username,
          username: user.username,
          email: user.email,
          enabled: user.isActive,
          role: user.role?.displayName || user.role?.name || 'User',
          roleName: user.role?.name,
          branch: user.branch || '',
          department: user.department || '',
          code: user.username,
          phone: user.phone || '',
          password: '****'
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // Fetch roles from backend
  const fetchRoles = async () => {
    try {
      const response = await rolesAPI.getAll();
      if (response.status === 'success') {
        // Map backend roles to app format
        const mappedRoles = response.data.roles.map(role => ({
          id: role._id,
          name: role.displayName || role.name,
          roleName: role.name,
          description: role.description || '',
          permissions: role.permissions || {},
          isActive: role.isActive
        }));
        setRoles(mappedRoles);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  // Fetch reservations from backend
  const fetchReservations = async () => {
    try {
      const response = await reservationsAPI.getAll();
      if (response.status === 'success') {
        setReservations(response.data.reservations || []);
      }
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  // Fetch users, roles, and reservations when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
      fetchRoles();
      fetchReservations();
    }
  }, [isLoggedIn]);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setNotificationMenuOpen(false); // Close notification menu when opening user menu
  };

  const toggleNotificationMenu = () => {
    setNotificationMenuOpen(!notificationMenuOpen);
    setUserMenuOpen(false); // Close user menu when opening notification menu
  };

  // Notification functions
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const addNotification = (type, icon, titleKey) => {
    const newNotification = {
      id: Date.now(),
      type,
      icon,
      titleKey,
      time: new Date(),
      isRead: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  // Handle saving reservation from NewReservationPage
  const handleSaveReservation = async (reservation) => {
    try {
      const response = await reservationsAPI.create(reservation);
      if (response.status === 'success') {
        // Refresh reservations list from backend
        await fetchReservations();
        // Switch to reservations list page to see the new reservation
        setCurrentPage('reservations');
      }
    } catch (error) {
      console.error('Failed to save reservation:', error);
      alert('Failed to save reservation: ' + (error.message || 'Unknown error'));
    }
  };

  // Handle adding supplier from AddSupplierPage
  const handleAddSupplier = (supplier) => {
    setSuppliers([...suppliers, supplier]);
    setCurrentPage('suppliers');
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.isRead).length;
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval + (isArabic ? ' سنة مضت' : ' year' + (interval > 1 ? 's' : '') + ' ago');
    }

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + (isArabic ? ' شهر مضى' : ' month' + (interval > 1 ? 's' : '') + ' ago');
    }

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + (isArabic ? ' يوم مضى' : ' day' + (interval > 1 ? 's' : '') + ' ago');
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + (isArabic ? ' ساعة مضت' : ' hour' + (interval > 1 ? 's' : '') + ' ago');
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + (isArabic ? ' دقيقة مضت' : ' minute' + (interval > 1 ? 's' : '') + ' ago');
    }

    return isArabic ? 'الآن' : 'just now';
  };

  // Get current date
  const getCurrentDate = () => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    if (isArabic) {
      return date.toLocaleDateString('ar-EG', options);
    } else {
      return date.toLocaleDateString('en-US', options);
    }
  };

  // Company name - always in English
  const companyName = "Egypt Holiday Makers";

  // Translations
  const translations = {
    en: {
      home: "Home",
      reservations: "Reservations",
      customers: "Customers",
      suppliers: "Suppliers",
      contracts: "Contracts",
      hotelContracts: "Hotel Contracts",
      addHotelContract: "Add Hotel Contract",
      managements: "Managements",
      users: "Users",
      roles: "Roles",
      allCustomers: "All Customers",
      addCustomer: "Add Customer",
      customerList: "Customer List",
      allSuppliers: "All Suppliers",
      addSupplier: "Add Supplier",
      orders: "Orders",
      allBookings: "All Bookings",
      packages: "Packages",
      itinerary: "Itinerary",
      tourGuideSchedule: "Tour Guide Schedule",
      reservationsList: "Reservations",
      newReservation: "New Reservation",
      reservationReport: "Reservation Report",
      statistics: "Statistics",
      airportTransfers: "Airport Transfers",
      addAirportTransfer: "Add Airport Transfer",
      visas: "Visas",
      addVisa: "Add Visa",
      balloons: "Balloons",
      balloon: "Balloon",
      hajjUmrah: "Hajj & Umrah",
      trips: "Trips",
      addTrip: "Add Trip",
      bags: "Bags",
      addBag: "Add Bag",
      bagPrices: "Bag Prices",
      accounting: "Accounting",
      welcome: "Welcome to Egypt Holiday Makers",
      subtitle: "Your dashboard is ready for action!",
      profile: "Profile",
      settings: "Settings",
      updates: "Updates",
      history: "History",
      logout: "Logout",
      admin: "admin",
      booking: "Booking",
      notifications: "Notifications",
      noNotifications: "No new notifications",
      newReservation: "New reservation received",
      paymentReceived: "Payment received",
      customerUpdate: "Customer profile updated",
      systemUpdate: "System maintenance scheduled",
      viewAll: "View All",
      markAsRead: "Mark as read",
      religious: "Religious",
      accounting: "Accounting",
      transportation: "Transportation",
      hrm: "HRM",
      flightReport: "Flight Report",
      visa: "Visa",
      hajjUmrah: "Hajj & Umrah",
      hotels: "Hotels",
      otherReport: "Other Report",
      insurance: "Insurance",
      rolesPage: "Roles",
      refreshPermissions: "Refresh Permissions",
      search: "Search",
      add: "Add",
      exportExcel: "Export Excel",
      id: "ID",
      name: "Name",
      result: "Result",
      of: "of",
      total: "Total",
      usersPage: "Users",
      enabled: "Enabled",
      role: "Role",
      branch: "Branch",
      department: "Department",
      authType: "AuthType",
      code: "Code",
      searchData: "Search Data",
      userName: "User name",
      email: "Email",
      clear: "Clear",
      addUser: "Add User",
      password: "Password",
      employeeRole: "Employee Role",
      isEmployee: "Is Employee ?"
    },
    ar: {
      home: "الرئيسية",
      reservations: "الحجوزات",
      customers: "العملاء",
      suppliers: "الموردين",
      contracts: "العقود",
      hotelContracts: "عقود الفنادق",
      addHotelContract: "إضافة عقد فندق",
      managements: "الإدارة",
      users: "المستخدمين",
      roles: "الأدوار",
      allCustomers: "جميع العملاء",
      addCustomer: "إضافة عميل",
      customerList: "قائمة العملاء",
      allSuppliers: "جميع الموردين",
      addSupplier: "إضافة مورد",
      orders: "الطلبات",
      allBookings: "جميع الحجوزات",
      packages: "الباقات",
      itinerary: "الإيتينيراري",
      tourGuideSchedule: "جدول مرشد سياحي",
      reservationsList: "الحجوزات",
      newReservation: "حجز جديد",
      reservationReport: "تقرير الحجوزات",
      statistics: "الإحصائيات",
      airportTransfers: "نقل المطار",
      addAirportTransfer: "إضافة نقل مطار",
      visas: "التأشيرات",
      addVisa: "إضافة تأشيرة",
      balloons: "المناطيد",
      balloon: "منطاد",
      hajjUmrah: "الحج والعمرة",
      trips: "الرحلات",
      addTrip: "إضافة رحلة",
      bags: "الأمتعة",
      addBag: "إضافة حقيبة",
      bagPrices: "أسعار الأمتعة",
      accounting: "المحاسبة",
      welcome: "مرحباً بك في Egypt Holiday Makers",
      subtitle: "لوحة التحكم جاهزة للعمل!",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      updates: "التحديثات",
      history: "السجل",
      logout: "تسجيل الخروج",
      admin: "مسؤول",
      booking: "الحجز",
      notifications: "الإشعارات",
      noNotifications: "لا توجد إشعارات جديدة",
      newReservation: "تم استلام حجز جديد",
      paymentReceived: "تم استلام الدفع",
      customerUpdate: "تم تحديث ملف العميل",
      systemUpdate: "صيانة النظام مجدولة",
      viewAll: "عرض الكل",
      markAsRead: "وضع علامة مقروء",
      religious: "الرحلات الدينية",
      accounting: "المحاسبة",
      transportation: "النقل",
      hrm: "الموارد البشرية",
      flightReport: "تقرير الرحلات",
      visa: "التأشيرات",
      hajjUmrah: "الحج والعمرة",
      hotels: "الفنادق",
      otherReport: "تقرير آخر",
      insurance: "التأمين",
      rolesPage: "الأدوار",
      refreshPermissions: "تحديث الصلاحيات",
      search: "بحث",
      add: "إضافة",
      exportExcel: "تصدير Excel",
      id: "الرقم",
      name: "الاسم",
      result: "النتيجة",
      of: "من",
      total: "الإجمالي",
      usersPage: "المستخدمين",
      enabled: "مفعل",
      role: "الدور",
      branch: "الفرع",
      department: "القسم",
      authType: "نوع المصادقة",
      code: "الكود",
      searchData: "بحث في البيانات",
      userName: "اسم المستخدم",
      email: "البريد الإلكتروني",
      clear: "مسح",
      addUser: "إضافة مستخدم",
      password: "كلمة المرور",
      employeeRole: "دور الموظف",
      isEmployee: "هل هو موظف ؟"
    }
  };

  const t = isArabic ? translations.ar : translations.en;

  const closeAllMenus = () => {
    setReservationsOpen(false);
    setAirportTransfersOpen(false);
    setVisasOpen(false);
    setBalloonsOpen(false);
    setHajjUmrahOpen(false);
    setBagsOpen(false);
    setBagPricesOpen(false);
    setPackagesOpen(false);
    setAccountingOpen(false);
    setCustomersOpen(false);
    setSuppliersOpen(false);
    setContractsOpen(false);
    setManagementsOpen(false);
    setAllBookingsOpen(false);
  };

  const toggleReservations = () => {
    console.log('Toggling reservations. Current:', reservationsOpen);
    const newState = !reservationsOpen;
    closeAllMenus();
    setReservationsOpen(newState);
  };

  const toggleAirportTransfers = () => {
    const newState = !airportTransfersOpen;
    closeAllMenus();
    setAirportTransfersOpen(newState);
  };

  const toggleVisas = () => {
    const newState = !visasOpen;
    closeAllMenus();
    setVisasOpen(newState);
  };

  const toggleBalloons = () => {
    const newState = !balloonsOpen;
    closeAllMenus();
    setBalloonsOpen(newState);
  };

  const toggleHajjUmrah = () => {
    const newState = !hajjUmrahOpen;
    closeAllMenus();
    setHajjUmrahOpen(newState);
  };

  const toggleBags = () => {
    const newState = !bagsOpen;
    closeAllMenus();
    setBagsOpen(newState);
  };

  const toggleBagPrices = () => {
    const newState = !bagPricesOpen;
    closeAllMenus();
    setBagPricesOpen(newState);
  };

  const togglePackages = () => {
    const newState = !packagesOpen;
    closeAllMenus();
    setPackagesOpen(newState);
  };

  const toggleAccounting = () => {
    const newState = !accountingOpen;
    closeAllMenus();
    setAccountingOpen(newState);
  };

  const toggleCustomers = () => {
    const newState = !customersOpen;
    closeAllMenus();
    setCustomersOpen(newState);
  };

  const toggleSuppliers = () => {
    const newState = !suppliersOpen;
    closeAllMenus();
    setSuppliersOpen(newState);
  };

  const toggleContracts = () => {
    const newState = !contractsOpen;
    closeAllMenus();
    setContractsOpen(newState);
  };

  const toggleManagements = () => {
    console.log('Toggling managements. Current:', managementsOpen);
    const newState = !managementsOpen;
    closeAllMenus();
    setManagementsOpen(newState);
  };

  const toggleSettings = () => {
    const newState = !settingsOpen;
    closeAllMenus();
    setSettingsOpen(newState);
  };

  const toggleAllBookings = () => {
    const newState = !allBookingsOpen;
    closeAllMenus();
    setAllBookingsOpen(newState);
  };

  // Roles page functions
  const addRole = () => {
    if (newRoleName.trim()) {
      const newRole = {
        id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
        name: newRoleName.trim()
      };
      setRoles([...roles, newRole]);
      setNewRoleName('');
      setShowAddModal(false);
    }
  };

  const deleteRole = (id) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const exportToExcel = () => {
    // Simple CSV export
    const csvContent = "data:text/csv;charset=utf-8,"
      + "ID,Name\n"
      + filteredAndSortedRoles.map(role => `${role.id},${role.name}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "roles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const refreshPermissions = () => {
    alert('Permissions refreshed!');
  };

  // Users page functions
  const handleSearchFilterChange = (field, value) => {
    setSearchFilters({
      ...searchFilters,
      [field]: value
    });
  };

  const clearSearchFilters = () => {
    setSearchFilters({
      userName: '',
      branch: 'All',
      department: '',
      role: '',
      email: '',
      enabled: 'All'
    });
  };

  const performSearch = () => {
    console.log('Searching with filters:', searchFilters);
    setShowSearchModal(false);
  };

  // Filter and sort users
  const filteredUsers = users.filter(user => {
    // Username filter
    if (searchFilters.userName && !user.userName.toLowerCase().includes(searchFilters.userName.toLowerCase())) {
      return false;
    }

    // Branch filter
    if (searchFilters.branch !== 'All' && user.branch !== searchFilters.branch) {
      return false;
    }

    // Department filter
    if (searchFilters.department && user.department !== searchFilters.department) {
      return false;
    }

    // Role filter
    if (searchFilters.role && user.role !== searchFilters.role) {
      return false;
    }

    // Email filter
    if (searchFilters.email && !user.email.toLowerCase().includes(searchFilters.email.toLowerCase())) {
      return false;
    }

    // Enabled filter
    if (searchFilters.enabled === 'Yes' && !user.enabled) {
      return false;
    }
    if (searchFilters.enabled === 'No' && user.enabled) {
      return false;
    }

    return true;
  });

  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const toggleUserEnabled = (id) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, enabled: !user.enabled } : user
    ));
  };

  // Handle right-click on user row
  const handleUserRightClick = (e, user) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      user: user
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      user: null
    });
  };

  // Handle edit user from context menu
  const handleEditUser = () => {
    if (contextMenu.user) {
      setEditingUser({
        ...contextMenu.user,
        password: '' // Don't show existing password
      });
      setShowEditUserModal(true);
    }
    closeContextMenu();
  };

  // Handle edit user form change
  const handleEditUserChange = (field, value) => {
    setEditingUser({
      ...editingUser,
      [field]: value
    });
  };

  // Save edited user
  const saveEditedUser = async () => {
    if (!editingUser) return;

    try {
      // Prepare update data
      const updateData = {
        fullName: editingUser.userName,
        email: editingUser.email,
        branch: editingUser.branch,
        department: editingUser.department,
        isActive: editingUser.enabled
      };

      // Only include password if it's been changed
      if (editingUser.password && editingUser.password.trim() !== '') {
        updateData.password = editingUser.password;
      }

      // Call backend API
      const response = await usersAPI.update(editingUser._id, updateData);

      if (response.status === 'success') {
        // Refresh users list
        await fetchUsers();

        // Close modal
        setShowEditUserModal(false);
        setEditingUser(null);

        alert('User updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user: ' + (error.message || 'Please try again'));
    }
  };

  // Close edit modal
  const closeEditUserModal = () => {
    setShowEditUserModal(false);
    setEditingUser(null);
  };

  const exportUsersToExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "ID,Username,Role,Branch,Department,Email,Enabled,Code\n"
      + filteredUsers.map(user =>
        `${user.id},${user.userName},${user.role},${user.branch},${user.department},${user.email || ''},${user.enabled ? 'Yes' : 'No'},${user.code}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewUserChange = (field, value) => {
    setNewUser({
      ...newUser,
      [field]: value
    });
  };

  const clearNewUser = () => {
    setNewUser({
      userName: '',
      password: '',
      branch: 'Cairo',
      department: 'Sales',
      role: roles.length > 0 ? roles[0].name : 'Admin',
      email: '',
      employeeRole: 'Manager',
      isEmployee: false,
      enabled: true,
      code: ''
    });
    setValidationErrors({});
    setShowPassword(false);
  };

  // Validation function
  const validateUser = () => {
    const errors = {};

    // Username validation
    if (!newUser.userName.trim()) {
      errors.userName = 'Username is required';
    } else if (newUser.userName.length < 3) {
      errors.userName = 'Username must be at least 3 characters';
    } else if (users.some(u => u.userName.toLowerCase() === newUser.userName.toLowerCase())) {
      errors.userName = 'Username already exists';
    }

    // Password validation
    if (!newUser.password) {
      errors.password = 'Password is required';
    } else if (newUser.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Email validation (optional but if provided must be valid)
    if (newUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = 'Invalid email format';
    }

    // Role validation
    if (!newUser.role || newUser.role.trim() === '') {
      errors.role = 'Role is required. Please add roles first in Managements > Roles';
    }

    return errors;
  };

  const addUser = async () => {
    console.log('Add user clicked, current user data:', newUser);

    // Validate user data
    const errors = validateUser();

    console.log('Validation errors:', errors);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      alert('Please fix the validation errors:\n' + Object.values(errors).join('\n'));
      return;
    }

    try {
      // Prepare user data for backend
      const userData = {
        username: newUser.userName.trim().toLowerCase().replace(/\s+/g, '_'),
        email: newUser.email.trim(),
        password: newUser.password,
        fullName: newUser.userName.trim(),
        phone: newUser.phone || '',
        roleName: newUser.role.toLowerCase(), // 'admin', 'manager', 'user'
        branch: newUser.branch,
        department: newUser.department
      };

      console.log('Sending to backend:', userData);

      // Call backend API
      const response = await usersAPI.create(userData);

      if (response.status === 'success') {
        console.log('User created successfully:', response.data.user);

        // Refresh users list from backend
        await fetchUsers();

        // Close modal and reset form
        setShowAddUserModal(false);
        clearNewUser();

        // Show success message
        alert(`User "${response.data.user.fullName}" created successfully!\n\nLogin credentials:\nUsername: ${response.data.user.username}\nPassword: (the password you entered)\n\nThey can login now!`);
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('Failed to add user: ' + (error.message || 'Please try again.\n\nMake sure the role name is correct (Admin, Manager, or User)'));
    }
  };

  // Filter and sort roles
  const filteredAndSortedRoles = roles
    .filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.id.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ehm_users', JSON.stringify(users));
  }, [users]);

  // Close submenus when clicking outside (but NOT when clicking on sidebar)
  // Close submenus when clicking outside (but NOT when clicking on sidebar)
  useEffect(() => {
    const handleDocumentClick = (event) => {
      // Check if click was outside sidebar using ref
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        console.log('📌 Document click handler: Clicked outside sidebar, closing menus.');
        closeAllMenus();

        // Also close user menu, notification menu, context menu if click is outside them
        if (!event.target.closest('.user-menu-container')) {
          setUserMenuOpen(false);
        }
        if (!event.target.closest('.notification-container')) {
          setNotificationMenuOpen(false);
        }
        if (!event.target.closest('.context-menu')) {
          closeContextMenu();
        }
      } else {
        console.log('📌 Document click handler: Clicked inside sidebar, doing nothing.');
      }
    };

    // Use standard click listener
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // Show login page if not logged in
  const sidebarRef = useRef(null);

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} isArabic={isArabic} toggleLanguage={toggleLanguage} />;
  }

  return (
    <div className={`dashboard ${isArabic ? 'rtl' : 'ltr'} ${isDarkMode ? 'dark-mode' : 'light-mode'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div 
        className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${sidebarExpanded ? 'sidebar-expanded' : ''}`} 
        ref={sidebarRef}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="sidebar-header">
          <h1 className="sidebar-title">{companyName}</h1>
        </div>
        <nav className="sidebar-nav">
          {/* Home without submenu */}
          <div
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => {
              console.log('Home clicked! Setting page to home');
              setCurrentPage('home');
            }}
            role="button"
            tabIndex={0}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">{t.home}</span>
          </div>

          {/* Reservations with submenu */}
          <div className="nav-item-container">
            <div
              className={`nav-item ${['reservations', 'newReservation', 'reservationReport', 'statistics'].includes(currentPage) ? 'active' : ''}`}
              onClick={() => {
                console.log('Reservations clicked!');
                toggleReservations();
              }}
            >
              <span className="nav-icon">📅</span>
              <span className="nav-text">{t.reservations}</span>
              <span className={`nav-arrow ${reservationsOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${reservationsOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div
                className={`submenu-item ${currentPage === 'reservations' ? 'active' : ''}`}
                onClick={() => {
                  console.log('Setting page to reservations');
                  setCurrentPage('reservations');
                }}
              >
                <span className="submenu-icon">📄</span>
                <span className="submenu-text">{t.reservationsList}</span>
              </div>
              <div className={`submenu-item ${currentPage === 'newReservation' ? 'active' : ''}`} onClick={() => { console.log('Setting page to newReservation'); setCurrentPage('newReservation'); }}>
                <span className="submenu-icon">➕</span>
                <span className="submenu-text">{t.newReservation}</span>
              </div>
              <div className={`submenu-item ${currentPage === 'reservationReport' ? 'active' : ''}`} onClick={() => { console.log('Setting page to reservationReport'); setCurrentPage('reservationReport'); }}>
                <span className="submenu-icon">📊</span>
                <span className="submenu-text">{t.reservationReport}</span>
              </div>
              <div className={`submenu-item ${currentPage === 'statistics' ? 'active' : ''}`} onClick={() => { console.log('Setting page to statistics'); setCurrentPage('statistics'); }}>
                <span className="submenu-icon">📈</span>
                <span className="submenu-text">{t.statistics}</span>
              </div>
            </div>
          </div>

          {/* Airport Transfers with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${['airportTransfers', 'addAirportTransfer'].includes(currentPage) ? 'active' : ''}`} onClick={() => { console.log('Airport Transfers clicked'); toggleAirportTransfers(); }}>
              <span className="nav-icon">🚗</span>
              <span className="nav-text">{t.airportTransfers}</span>
              <span className={`nav-arrow ${airportTransfersOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${airportTransfersOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'airportTransfers' ? 'active' : ''}`} onClick={() => { console.log('Setting page to airportTransfers'); setCurrentPage('airportTransfers'); }}>
                <span className="submenu-icon">📋</span>
                <span className="submenu-text">{t.airportTransfers}</span>
              </div>
              <div className={`submenu-item ${currentPage === 'addAirportTransfer' ? 'active' : ''}`} onClick={() => { console.log('Setting page to addAirportTransfer'); setCurrentPage('addAirportTransfer'); }}>
                <span className="submenu-icon">➕</span>
                <span className="submenu-text">{t.addAirportTransfer}</span>
              </div>
            </div>
          </div>

          {/* Visas with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${currentPage === 'visas' ? 'active' : ''}`} onClick={() => { console.log('Visas clicked'); toggleVisas(); }}>
              <span className="nav-icon">🛂</span>
              <span className="nav-text">{t.visas}</span>
              <span className={`nav-arrow ${visasOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${visasOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'visas' ? 'active' : ''}`} onClick={() => { console.log('Setting page to visas'); setCurrentPage('visas'); }}>
                <span className="submenu-icon">📋</span>
                <span className="submenu-text">{t.visas}</span>
              </div>
            </div>
          </div>

          {/* Balloons with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${currentPage === 'balloon' ? 'active' : ''}`} onClick={() => { console.log('Balloons clicked'); toggleBalloons(); }}>
              <span className="nav-icon">🎈</span>
              <span className="nav-text">{t.balloons}</span>
              <span className={`nav-arrow ${balloonsOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${balloonsOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'balloon' ? 'active' : ''}`} onClick={() => { console.log('Setting page to balloon'); setCurrentPage('balloon'); }}>
                <span className="submenu-icon">📋</span>
                <span className="submenu-text">{t.balloon}</span>
              </div>
            </div>
          </div>

          {/* Hajj & Umrah with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${currentPage === 'trips' ? 'active' : ''}`} onClick={() => { console.log('Hajj & Umrah clicked'); toggleHajjUmrah(); }}>
              <span className="nav-icon">🕌</span>
              <span className="nav-text">{t.hajjUmrah}</span>
              <span className={`nav-arrow ${hajjUmrahOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${hajjUmrahOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'trips' ? 'active' : ''}`} onClick={() => { console.log('Setting page to trips'); setCurrentPage('trips'); }}>
                <span className="submenu-icon">📋</span>
                <span className="submenu-text">{t.trips}</span>
              </div>
            </div>
          </div>

          {/* Bags with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${currentPage === 'bags' ? 'active' : ''}`} onClick={() => { console.log('Bags clicked'); toggleBags(); }}>
              <span className="nav-icon">🎒</span>
              <span className="nav-text">{t.bags}</span>
              <span className={`nav-arrow ${bagsOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${bagsOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'bags' ? 'active' : ''}`} onClick={() => { console.log('Setting page to bags'); setCurrentPage('bags'); }}>
                <span className="submenu-icon">📋</span>
                <span className="submenu-text">{t.bags}</span>
              </div>
            </div>
          </div>

          {/* Bag Prices with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${currentPage === 'bagPrices' ? 'active' : ''}`} onClick={() => { console.log('Bag Prices clicked'); toggleBagPrices(); }}>
              <span className="nav-icon">💰</span>
              <span className="nav-text">{t.bagPrices}</span>
              <span className={`nav-arrow ${bagPricesOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${bagPricesOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'bagPrices' ? 'active' : ''}`} onClick={() => { console.log('Setting page to bagPrices'); setCurrentPage('bagPrices'); }}>
                <span className="submenu-icon">📋</span>
                <span className="submenu-text">{t.bagPrices}</span>
              </div>
            </div>
          </div>

          {/* Packages with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${currentPage === 'packages' ? 'active' : ''}`} onClick={() => { console.log('Packages clicked'); togglePackages(); }}>
              <span className="nav-icon">📦</span>
              <span className="nav-text">{t.packages}</span>
              <span className={`nav-arrow ${packagesOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${packagesOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'packages' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setCurrentPage('packages'); }}>
                <span className="submenu-icon">📋</span>
                <span className="submenu-text">{t.packages}</span>
              </div>
            </div>
          </div>

          {/* Accounting with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${currentPage === 'accounting' ? 'active' : ''}`} onClick={() => { console.log('Accounting clicked'); toggleAccounting(); }}>
              <span className="nav-icon">💰</span>
              <span className="nav-text">{t.accounting}</span>
              <span className={`nav-arrow ${accountingOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${accountingOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'accounting' ? 'active' : ''}`} onClick={() => { console.log('Setting page to accounting'); setCurrentPage('accounting'); }}>
                <span className="submenu-icon">📋</span>
                <span className="submenu-text">{t.accounting}</span>
              </div>
            </div>
          </div>

          {/* Customers with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${['customers', 'addCustomer'].includes(currentPage) ? 'active' : ''}`} onClick={() => { console.log('Customers clicked'); toggleCustomers(); }}>
              <span className="nav-icon">👤</span>
              <span className="nav-text">{t.customers}</span>
              <span className={`nav-arrow ${customersOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${customersOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'addCustomer' ? 'active' : ''}`} onClick={() => { console.log('Setting page to addCustomer'); setCurrentPage('addCustomer'); }}>
                <span className="submenu-icon">➕</span>
                <span className="submenu-text">{t.addCustomer}</span>
              </div>
              <div className={`submenu-item ${currentPage === 'customers' ? 'active' : ''}`} onClick={() => { console.log('Setting page to customers'); setCurrentPage('customers'); }}>
                <span className="submenu-icon">📋</span>
                <span className="submenu-text">{t.customerList}</span>
              </div>
            </div>
          </div>

          {/* Suppliers with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${['suppliers', 'addSupplier'].includes(currentPage) ? 'active' : ''}`} onClick={() => { console.log('Suppliers clicked'); toggleSuppliers(); }}>
              <span className="nav-icon">🏢</span>
              <span className="nav-text">{t.suppliers}</span>
              <span className={`nav-arrow ${suppliersOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${suppliersOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'suppliers' ? 'active' : ''}`} onClick={() => { console.log('Setting page to suppliers'); setCurrentPage('suppliers'); }}>
                <span className="submenu-icon">🏭</span>
                <span className="submenu-text">{t.allSuppliers}</span>
              </div>
              <div className={`submenu-item ${currentPage === 'addSupplier' ? 'active' : ''}`} onClick={() => { console.log('Setting page to addSupplier'); setCurrentPage('addSupplier'); }}>
                <span className="submenu-icon">➕</span>
                <span className="submenu-text">{t.addSupplier}</span>
              </div>
            </div>
          </div>

          {/* Contracts with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${['hotelContracts', 'addHotelContract'].includes(currentPage) ? 'active' : ''}`} onClick={() => { console.log('Contracts clicked'); toggleContracts(); }}>
              <span className="nav-icon">📋</span>
              <span className="nav-text">{t.contracts}</span>
              <span className={`nav-arrow ${contractsOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${contractsOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'hotelContracts' ? 'active' : ''}`} onClick={() => { console.log('Setting page to hotelContracts'); setCurrentPage('hotelContracts'); }}>
                <span className="submenu-icon">🏨</span>
                <span className="submenu-text">{t.hotelContracts}</span>
              </div>
              <div className={`submenu-item ${currentPage === 'addHotelContract' ? 'active' : ''}`} onClick={() => { console.log('Setting page to addHotelContract'); setCurrentPage('addHotelContract'); }}>
                <span className="submenu-icon">➕</span>
                <span className="submenu-text">{t.addHotelContract}</span>
              </div>
            </div>
          </div>

          {/* All Bookings with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${['packages', 'itinerary', 'tourGuideSchedule'].includes(currentPage) ? 'active' : ''}`} onClick={() => { console.log('All Bookings clicked'); toggleAllBookings(); }}>
              <span className="nav-icon">📦</span>
              <span className="nav-text">{t.allBookings}</span>
              <span className={`nav-arrow ${allBookingsOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${allBookingsOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'packages' ? 'active' : ''}`} onClick={() => { console.log('Setting page to packages'); setCurrentPage('packages'); }}>
                <span className="submenu-icon">📦</span>
                <span className="submenu-text">{t.packages}</span>
              </div>
              <div className={`submenu-item ${currentPage === 'itinerary' ? 'active' : ''}`} onClick={() => { console.log('Setting page to itinerary'); setCurrentPage('itinerary'); }}>
                <span className="submenu-icon">🗺️</span>
                <span className="submenu-text">{t.itinerary}</span>
              </div>
              <div className={`submenu-item ${currentPage === 'tourGuideSchedule' ? 'active' : ''}`} onClick={() => { console.log('Setting page to tourGuideSchedule'); setCurrentPage('tourGuideSchedule'); }}>
                <span className="submenu-icon">👨‍🏫</span>
                <span className="submenu-text">{t.tourGuideSchedule}</span>
              </div>
            </div>
          </div>

          {/* Managements with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${['users', 'roles'].includes(currentPage) ? 'active' : ''}`} onClick={() => { console.log('Managements clicked'); toggleManagements(); }}>
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">{t.managements}</span>
              <span className={`nav-arrow ${managementsOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${managementsOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'users' ? 'active' : ''}`} onClick={() => { console.log('Setting page to users'); setCurrentPage('users'); }}>
                <span className="submenu-icon">👨‍💼</span>
                <span className="submenu-text">{t.users}</span>
              </div>
              <div className={`submenu-item ${currentPage === 'roles' ? 'active' : ''}`} onClick={() => { console.log('Setting page to roles'); setCurrentPage('roles'); }}>
                <span className="submenu-icon">🔐</span>
                <span className="submenu-text">{t.roles}</span>
              </div>
            </div>
          </div>

          {/* Settings with submenu */}
          <div className="nav-item-container">
            <div className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => {
              console.log('Settings clicked');
              toggleSettings();
            }}>
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">{t.settings}</span>
              <span className={`nav-arrow ${settingsOpen ? 'nav-arrow-open' : 'nav-arrow-closed'}`}>▶</span>
            </div>
            <div className={`submenu ${settingsOpen ? 'submenu-open' : 'submenu-closed'}`}>
              <div className={`submenu-item ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => {
                console.log('Setting page to settings');
                setCurrentPage('settings');
              }}>
                <span className="submenu-icon">⚙️</span>
                <span className="submenu-text">{t.settings}</span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content with Banner */}
      <div className="main-content">
        {/* Upper Banner */}
        <div className="top-banner">
          <div className="banner-content">
            <div className="banner-left">
              <button className={`menu-icon ${sidebarOpen ? 'menu-open' : 'menu-closed'}`} onClick={toggleSidebar}>
                {sidebarOpen ? '☰' : '☰'}
              </button>
              <button className="more-icon">⋮</button>
            </div>
            <div className="banner-center">
              <div className="notification-container">
                <button className="notification-icon" onClick={toggleNotificationMenu}>
                  🔔
                  {getUnreadCount() > 0 && (
                    <span className="notification-badge">{getUnreadCount()}</span>
                  )}
                </button>
                {notificationMenuOpen && (
                  <div className="notification-dropdown-menu">
                    <div className="notification-header">
                      <h3>{t.notifications}</h3>
                      {getUnreadCount() > 0 && (
                        <button className="mark-all-read" onClick={markAllNotificationsAsRead}>
                          {t.markAsRead}
                        </button>
                      )}
                    </div>
                    <div className="notification-items">
                      {notifications.length === 0 ? (
                        <div className="no-notifications">
                          <div className="no-notifications-icon">🔕</div>
                          <p>{t.noNotifications}</p>
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="notification-icon-circle">{notification.icon}</div>
                            <div className="notification-content">
                              <div className="notification-title">{t[notification.titleKey]}</div>
                              <div className="notification-time">{getTimeAgo(notification.time)}</div>
                            </div>
                            <button
                              className="notification-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              title={isArabic ? 'حذف' : 'Delete'}
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="notification-footer">
                        <button className="view-all-btn">{t.viewAll}</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="banner-right">
              <button
                className={`theme-icon ${isDarkMode ? 'active' : ''}`}
                onClick={toggleDarkMode}
                title={isDarkMode ? (isArabic ? 'الوضع الفاتح' : 'Light Mode') : (isArabic ? 'الوضع الداكن' : 'Dark Mode')}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button className={`globe-icon ${isArabic ? 'active' : ''}`} onClick={toggleLanguage} title={isArabic ? "Switch to English" : "التبديل إلى العربية"}>🌐</button>
            </div>
          </div>
          <div className="banner-date">
            <span>{getCurrentDate()}</span>
            <div className="user-menu-container">
              <div className="user-info" onClick={toggleUserMenu}>
                <span className="user-name-banner">{currentUser?.fullName || currentUser?.username || 'User'}</span>
                <div className="user-avatar-banner">
                  {currentUser?.profileImage ? (
                    <img src={currentUser.profileImage} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    '👤'
                  )}
                </div>
              </div>
              {userMenuOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <div className="user-avatar-large">
                      {currentUser?.profileImage ? (
                        <img src={currentUser.profileImage} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        '👤'
                      )}
                    </div>
                    <div className="user-details">
                      <div className="user-name-large">{currentUser?.fullName || currentUser?.username || 'User'}</div>
                      <div className="user-role">{currentUser?.role?.displayName || currentUser?.role || t.admin}</div>
                    </div>
                  </div>
                  <div className="user-dropdown-items">
                    <div className="user-dropdown-item" onClick={() => setCurrentPage('profile')}>
                      <span className="dropdown-icon">👤</span>
                      <span className="dropdown-text">{t.profile}</span>
                    </div>
                    <div className="user-dropdown-item" onClick={() => setCurrentPage('settings')}>
                      <span className="dropdown-icon">⚙️</span>
                      <span className="dropdown-text">{t.settings}</span>
                    </div>
                    <div className="user-dropdown-item" onClick={() => setCurrentPage('updates')}>
                      <span className="dropdown-icon">📋</span>
                      <span className="dropdown-text">{t.updates}</span>
                    </div>
                    <div className="user-dropdown-item history-item">
                      <span className="dropdown-icon">🕐</span>
                      <span className="dropdown-text">{t.history}</span>
                    </div>
                    <div className="user-dropdown-item logout-item" onClick={handleLogout}>
                      <span className="dropdown-icon">🚪</span>
                      <span className="dropdown-text">{t.logout}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {currentPage === 'home' && (
            <>
              <div className="welcome-section">
                <h2 className="welcome-title">{t.welcome}</h2>
                <p className="welcome-subtitle">{t.subtitle}</p>
              </div>

              {/* Shortcuts Grid */}
              <div className="shortcuts-container">
                <div className="shortcut-card blue-card" onClick={() => setCurrentPage('reservations')}>
                  <div className="shortcut-icon">📅</div>
                  <div className="shortcut-text">{t.reservations}</div>
                </div>

                <div className="shortcut-card orange-card">
                  <div className="shortcut-icon">✈️</div>
                  <div className="shortcut-text">{t.booking}</div>
                </div>

                <div className="shortcut-card cyan-card">
                  <div className="shortcut-icon">🏛️</div>
                  <div className="shortcut-text">{t.religious}</div>
                </div>

                <div className="shortcut-card green-card">
                  <div className="shortcut-icon">💰</div>
                  <div className="shortcut-text">{t.accounting}</div>
                </div>

                <div className="shortcut-card pink-card">
                  <div className="shortcut-icon">🚌</div>
                  <div className="shortcut-text">{t.transportation}</div>
                </div>

                <div className="shortcut-card gray-card">
                  <div className="shortcut-icon">👥</div>
                  <div className="shortcut-text">{t.hrm}</div>
                </div>
              </div>

              {/* Reservation Report Section */}
              <div className="report-section-home">
                <div className="report-header">
                  <div className="report-icon">📊</div>
                  <h2 className="report-title">{t.reservationReport}</h2>
                </div>

                <div className="report-shortcuts-grid">
                  <div className="report-shortcut-item">
                    <div className="report-shortcut-icon blue-bg">
                      <span>✈️</span>
                    </div>
                    <div className="report-shortcut-text">{t.flightReport}</div>
                    <div className="report-arrow">›</div>
                  </div>

                  <div className="report-shortcut-item">
                    <div className="report-shortcut-icon cyan-bg">
                      <span>📄</span>
                    </div>
                    <div className="report-shortcut-text">{t.visa}</div>
                    <div className="report-arrow">›</div>
                  </div>

                  <div className="report-shortcut-item">
                    <div className="report-shortcut-icon green-bg">
                      <span>🕌</span>
                    </div>
                    <div className="report-shortcut-text">{t.hajjUmrah}</div>
                    <div className="report-arrow">›</div>
                  </div>

                  <div className="report-shortcut-item">
                    <div className="report-shortcut-icon purple-bg">
                      <span>🏨</span>
                    </div>
                    <div className="report-shortcut-text">{t.hotels}</div>
                    <div className="report-arrow">›</div>
                  </div>

                  <div className="report-shortcut-item">
                    <div className="report-shortcut-icon gray-bg">
                      <span>📋</span>
                    </div>
                    <div className="report-shortcut-text">{t.otherReport}</div>
                    <div className="report-arrow">›</div>
                  </div>

                  <div className="report-shortcut-item">
                    <div className="report-shortcut-icon orange-bg">
                      <span>🛡️</span>
                    </div>
                    <div className="report-shortcut-text">{t.insurance}</div>
                    <div className="report-arrow">›</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentPage === 'reservations' && (
            <ReservationsPage
              isArabic={isArabic}
              reservations={reservations}
              setReservations={setReservations}
              onRefreshReservations={fetchReservations}
            />
          )}

          {currentPage === 'newReservation' && (
            <NewReservationPage
              isArabic={isArabic}
              onSaveReservation={handleSaveReservation}
            />
          )}

          {currentPage === 'profile' && (
            <ProfilePage
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              isArabic={isArabic}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              isArabic={isArabic}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              onToggleLanguage={toggleLanguage}
            />
          )}

          {currentPage === 'updates' && (
            <UpdatesPage
              isArabic={isArabic}
            />
          )}

          {currentPage === 'statistics' && (
            <StatisticsPage
              isArabic={isArabic}
            />
          )}

          {currentPage === 'suppliers' && (
            <SuppliersPage
              isArabic={isArabic}
              suppliers={suppliers}
            />
          )}

          {currentPage === 'addSupplier' && (
            <AddSupplierPage
              isArabic={isArabic}
              onAddSupplier={handleAddSupplier}
            />
          )}

          {currentPage === 'customers' && (
            <CustomersPage
              t={t}
              setCurrentPage={setCurrentPage}
            />
          )}

          {currentPage === 'addCustomer' && (
            <AddCustomerPage
              t={t}
              onSuccess={() => setCurrentPage('customers')}
            />
          )}

          {currentPage === 'hotelContracts' && (
            <HotelContractsPage
              t={t}
              setCurrentPage={setCurrentPage}
            />
          )}

          {currentPage === 'addHotelContract' && (
            <AddHotelContractPage
              t={t}
              onSuccess={() => setCurrentPage('hotelContracts')}
            />
          )}

          {currentPage === 'packages' && (
            <PackagesPage
              isArabic={isArabic}
              t={t}
            />
          )}

          {currentPage === 'itinerary' && (
            <ItineraryPage
              isArabic={isArabic}
              t={t}
            />
          )}

          {currentPage === 'tourGuideSchedule' && (
            <TourGuideSchedulePage
              isArabic={isArabic}
              t={t}
            />
          )}

          {currentPage === 'airportTransfers' && (
            <AirportTransfersPage
              t={t}
              setCurrentPage={setCurrentPage}
            />
          )}

          {currentPage === 'addAirportTransfer' && (
            <AddAirportTransferPage
              isArabic={isArabic}
              t={t}
            />
          )}

          {currentPage === 'visas' && (
            <VisasPage
              t={t}
              setCurrentPage={setCurrentPage}
            />
          )}

          {currentPage === 'balloon' && (
            <BalloonPage
              t={t}
              setCurrentPage={setCurrentPage}
            />
          )}

          {currentPage === 'trips' && (
            <TripsPage
              t={t}
              setCurrentPage={setCurrentPage}
            />
          )}

          {currentPage === 'bags' && (
            <BagsPage
              t={t}
              setCurrentPage={setCurrentPage}
            />
          )}

          {currentPage === 'bagPrices' && (
            <BagPricesPage
              t={t}
              setCurrentPage={setCurrentPage}
            />
          )}

          {currentPage === 'accounting' && (
            <AccountingPage
              t={t}
              setCurrentPage={setCurrentPage}
            />
          )}



          {currentPage === 'reservationReport' && (
            <div className="reports-page-new">
              <div className="reports-page-header">
                <h1 className="reports-page-title">Reports</h1>
              </div>

              <div className="reports-buttons-grid">
                <button className="report-button">
                  General Report
                </button>

                <button className="report-button">
                  General Flight Report
                </button>

                <button className="report-button">
                  Flight Report
                </button>

                <button className="report-button">
                  Visa
                </button>

                <button className="report-button">
                  Hotel Reports
                </button>

                <button className="report-button">
                  Hotel Feature Reports
                </button>

                <button className="report-button">
                  Hajj & Umrah Report
                </button>

                <button className="report-button">
                  Hajj & Umrah Payment Report
                </button>

                <button className="report-button">
                  Hajj & Umrah Client Payment
                </button>

                <button className="report-button report-button-full">
                  Transportation Report
                </button>

                <button className="report-button report-button-full">
                  Other Report
                </button>

                <button className="report-button report-button-full">
                  Insurances Reports
                </button>
              </div>
            </div>
          )}

          {currentPage === 'roles' && (
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
                  <button className="pagination-refresh" onClick={() => setSearchTerm('')}>🔄</button>
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
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h2>{t.add} {t.rolesPage}</h2>
                      <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
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
                      <button className="modal-cancel" onClick={() => setShowAddModal(false)}>
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
          )}

          {currentPage === 'users' && (
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
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr className="empty-row">
                        <td colSpan="8" className="empty-message">
                          {users.length === 0 ? 'No users added yet' : 'No users match the search criteria'}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr
                          key={user.id}
                          onContextMenu={(e) => handleUserRightClick(e, user)}
                          className="user-row"
                        >
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
                <div className="search-modal-overlay" onClick={() => setShowSearchModal(false)}>
                  <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="search-modal-header">
                      <div className="search-modal-title">
                        <span className="search-modal-icon">🔍</span>
                        <h2>{t.searchData}</h2>
                      </div>
                      <button className="modal-close" onClick={() => setShowSearchModal(false)}>✕</button>
                    </div>

                    <div className="search-modal-body">
                      <div className="search-form-grid">
                        {/* User name */}
                        <div className="search-form-field">
                          <label className="search-label">
                            {t.userName} <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className="search-form-input highlight-green"
                            value={searchFilters.userName}
                            onChange={(e) => handleSearchFilterChange('userName', e.target.value)}
                          />
                        </div>

                        {/* Branch */}
                        <div className="search-form-field">
                          <label className="search-label">
                            {t.branch} <span className="required">*</span>
                          </label>
                          <div className="search-select-wrapper">
                            <select
                              className="search-form-select"
                              value={searchFilters.branch}
                              onChange={(e) => handleSearchFilterChange('branch', e.target.value)}
                            >
                              <option>All</option>
                              <option>Cairo</option>
                              <option>Luxor</option>
                              <option>Aswan</option>
                            </select>
                            <button className="clear-select-btn">✕</button>
                          </div>
                        </div>

                        {/* Department */}
                        <div className="search-form-field">
                          <label className="search-label">
                            {t.department} <span className="required">*</span>
                          </label>
                          <select
                            className="search-form-select"
                            value={searchFilters.department}
                            onChange={(e) => handleSearchFilterChange('department', e.target.value)}
                          >
                            <option>Sales</option>
                            <option>Accounting</option>
                            <option>Operation</option>
                          </select>
                        </div>

                        {/* Role */}
                        <div className="search-form-field">
                          <label className="search-label">
                            {t.role} <span className="required">*</span>
                          </label>
                          <select
                            className="search-form-select"
                            value={searchFilters.role}
                            onChange={(e) => handleSearchFilterChange('role', e.target.value)}
                          >
                            {roles.map(role => (
                              <option key={role.id} value={role.name}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Email */}
                        <div className="search-form-field">
                          <label className="search-label">{t.email}</label>
                          <input
                            type="email"
                            className="search-form-input"
                            value={searchFilters.email}
                            onChange={(e) => handleSearchFilterChange('email', e.target.value)}
                          />
                        </div>

                        {/* Enabled */}
                        <div className="search-form-field">
                          <label className="search-label">
                            {t.enabled} <span className="required">*</span>
                          </label>
                          <select
                            className="search-form-select"
                            value={searchFilters.enabled}
                            onChange={(e) => handleSearchFilterChange('enabled', e.target.value)}
                          >
                            <option>All</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="search-modal-footer">
                      <button className="search-clear-btn" onClick={clearSearchFilters}>
                        {t.clear}
                      </button>
                      <button className="search-submit-btn" onClick={performSearch}>
                        <span className="btn-icon">🔍</span>
                        {t.search}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add User Modal */}
              {showAddUserModal && (
                <div className="add-user-modal-overlay" onClick={() => setShowAddUserModal(false)}>
                  <div className="add-user-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="add-user-modal-header">
                      <div className="add-user-modal-title">
                        <span className="add-user-modal-icon">➕</span>
                        <h2>{t.addUser}</h2>
                      </div>
                      <button className="modal-close" onClick={() => setShowAddUserModal(false)}>✕</button>
                    </div>

                    <div className="add-user-modal-body">
                      <div className="add-user-form-grid">
                        {/* User name */}
                        <div className="add-user-form-field">
                          <label className="add-user-label">
                            {t.userName} <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className={`add-user-form-input ${validationErrors.userName ? 'input-error' : ''}`}
                            placeholder={t.userName}
                            value={newUser.userName}
                            onChange={(e) => {
                              handleNewUserChange('userName', e.target.value);
                              if (validationErrors.userName) {
                                setValidationErrors({ ...validationErrors, userName: null });
                              }
                            }}
                          />
                          {validationErrors.userName && (
                            <span className="error-message">{validationErrors.userName}</span>
                          )}
                        </div>

                        {/* Password */}
                        <div className="add-user-form-field">
                          <label className="add-user-label">
                            {t.password} <span className="required">*</span>
                          </label>
                          <div className="password-input-wrapper">
                            <input
                              type={showPassword ? "text" : "password"}
                              className={`add-user-form-input ${validationErrors.password ? 'input-error' : ''}`}
                              placeholder="Password"
                              value={newUser.password}
                              onChange={(e) => {
                                handleNewUserChange('password', e.target.value);
                                if (validationErrors.password) {
                                  setValidationErrors({ ...validationErrors, password: null });
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="password-toggle-btn"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? '🙈' : '👁️'}
                            </button>
                          </div>
                          {validationErrors.password && (
                            <span className="error-message">{validationErrors.password}</span>
                          )}
                        </div>

                        {/* Branch */}
                        <div className="add-user-form-field">
                          <label className="add-user-label">
                            {t.branch} <span className="required">*</span>
                          </label>
                          <select
                            className="add-user-form-select"
                            value={newUser.branch}
                            onChange={(e) => handleNewUserChange('branch', e.target.value)}
                          >
                            <option>Cairo</option>
                            <option>Luxor</option>
                            <option>Aswan</option>
                          </select>
                        </div>

                        {/* Department */}
                        <div className="add-user-form-field">
                          <label className="add-user-label">
                            {t.department} <span className="required">*</span>
                          </label>
                          <select
                            className="add-user-form-select"
                            value={newUser.department}
                            onChange={(e) => handleNewUserChange('department', e.target.value)}
                          >
                            <option>Sales</option>
                            <option>Accounting</option>
                            <option>Operation</option>
                          </select>
                        </div>

                        {/* Role */}
                        <div className="add-user-form-field">
                          <label className="add-user-label">
                            {t.role} <span className="required">*</span>
                          </label>
                          <select
                            className={`add-user-form-select ${validationErrors.role ? 'input-error' : ''}`}
                            value={newUser.role}
                            onChange={(e) => {
                              handleNewUserChange('role', e.target.value);
                              if (validationErrors.role) {
                                setValidationErrors({ ...validationErrors, role: null });
                              }
                            }}
                          >
                            {roles.length === 0 ? (
                              <option value="">No roles available - Add roles first</option>
                            ) : (
                              roles.map(role => (
                                <option key={role.id} value={role.name}>
                                  {role.name}
                                </option>
                              ))
                            )}
                          </select>
                          {validationErrors.role && (
                            <span className="error-message">{validationErrors.role}</span>
                          )}
                        </div>

                        {/* Email */}
                        <div className="add-user-form-field">
                          <label className="add-user-label">{t.email}</label>
                          <input
                            type="email"
                            className="add-user-form-input"
                            placeholder={t.email}
                            value={newUser.email}
                            onChange={(e) => handleNewUserChange('email', e.target.value)}
                          />
                        </div>

                        {/* Is Employee Checkbox */}
                        <div className="add-user-form-field checkbox-field">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              className="employee-checkbox"
                              checked={newUser.isEmployee}
                              onChange={(e) => handleNewUserChange('isEmployee', e.target.checked)}
                            />
                            <span className="checkbox-text">{t.isEmployee}</span>
                          </label>
                        </div>

                        {/* Employee Role - Only show when isEmployee is checked */}
                        {newUser.isEmployee && (
                          <div className="add-user-form-field">
                            <label className="add-user-label">{t.employeeRole}</label>
                            <select
                              className="add-user-form-select"
                              value={newUser.employeeRole}
                              onChange={(e) => handleNewUserChange('employeeRole', e.target.value)}
                            >
                              <option>Manager</option>
                              <option>Supervisor</option>
                              <option>Staff</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="add-user-modal-footer">
                      <button className="add-user-clear-btn" onClick={clearNewUser}>
                        {t.clear}
                      </button>
                      <button className="add-user-submit-btn" onClick={addUser}>
                        <span className="btn-icon">➕</span>
                        {t.add}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Context Menu for Users */}
              {contextMenu.visible && (
                <div
                  className="context-menu"
                  style={{
                    position: 'absolute',
                    top: `${contextMenu.y}px`,
                    left: `${contextMenu.x}px`,
                    zIndex: 9999
                  }}
                >
                  <div className="context-menu-item" onClick={handleEditUser}>
                    <span className="context-menu-icon">✏️</span>
                    <span>Edit User</span>
                  </div>
                  <div className="context-menu-item" onClick={() => {
                    deleteUser(contextMenu.user.id);
                    closeContextMenu();
                  }}>
                    <span className="context-menu-icon">🗑️</span>
                    <span>Delete User</span>
                  </div>
                  <div className="context-menu-divider"></div>
                  <div className="context-menu-item" onClick={closeContextMenu}>
                    <span className="context-menu-icon">✖️</span>
                    <span>Cancel</span>
                  </div>
                </div>
              )}

              {/* Edit User Modal */}
              {showEditUserModal && editingUser && (
                <div className="add-user-modal-overlay" onClick={closeEditUserModal}>
                  <div className="add-user-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="add-user-modal-header">
                      <div className="add-user-modal-title">
                        <span className="add-user-modal-icon">✏️</span>
                        <h2>Edit User</h2>
                      </div>
                      <button className="modal-close" onClick={closeEditUserModal}>✕</button>
                    </div>

                    <div className="add-user-modal-body">
                      <div className="add-user-form-grid">
                        {/* User name */}
                        <div className="add-user-form-field">
                          <label className="add-user-label">
                            {t.userName} <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className="add-user-form-input"
                            placeholder={t.userName}
                            value={editingUser.userName}
                            onChange={(e) => handleEditUserChange('userName', e.target.value)}
                          />
                        </div>

                        {/* Password */}
                        <div className="add-user-form-field">
                          <label className="add-user-label">
                            {t.password} <span className="optional-label">(Leave blank to keep current)</span>
                          </label>
                          <div className="password-input-wrapper">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="add-user-form-input"
                              placeholder="New password (optional)"
                              value={editingUser.password}
                              onChange={(e) => handleEditUserChange('password', e.target.value)}
                            />
                            <button
                              type="button"
                              className="password-toggle-btn"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? '🙈' : '👁️'}
                            </button>
                          </div>
                        </div>

                        {/* Branch */}
                        <div className="add-user-form-field">
                          <label className="add-user-label">
                            {t.branch} <span className="required">*</span>
                          </label>
                          <select
                            className="add-user-form-select"
                            value={editingUser.branch}
                            onChange={(e) => handleEditUserChange('branch', e.target.value)}
                          >
                            <option>Cairo</option>
                            <option>Luxor</option>
                            <option>Aswan</option>
                          </select>
                        </div>

                        {/* Department */}
                        <div className="add-user-form-field">
                          <label className="add-user-label">
                            {t.department} <span className="required">*</span>
                          </label>
                          <select
                            className="add-user-form-select"
                            value={editingUser.department}
                            onChange={(e) => handleEditUserChange('department', e.target.value)}
                          >
                            <option>Sales</option>
                            <option>Accounting</option>
                            <option>Operation</option>
                          </select>
                        </div>

                        {/* Email */}
                        <div className="add-user-form-field">
                          <label className="add-user-label">{t.email}</label>
                          <input
                            type="email"
                            className="add-user-form-input"
                            placeholder={t.email}
                            value={editingUser.email}
                            onChange={(e) => handleEditUserChange('email', e.target.value)}
                          />
                        </div>

                        {/* Enabled */}
                        <div className="add-user-form-field checkbox-field">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              className="employee-checkbox"
                              checked={editingUser.enabled}
                              onChange={(e) => handleEditUserChange('enabled', e.target.checked)}
                            />
                            <span className="checkbox-text">{t.enabled}</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="add-user-modal-footer">
                      <button className="add-user-clear-btn" onClick={closeEditUserModal}>
                        Cancel
                      </button>
                      <button className="add-user-submit-btn" onClick={saveEditedUser}>
                        <span className="btn-icon">💾</span>
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;
