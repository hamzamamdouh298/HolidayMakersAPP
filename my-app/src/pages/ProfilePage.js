import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const ProfilePage = ({ currentUser, onUpdateProfile, isArabic }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    role: '',
    branch: '',
    department: '',
    profileImage: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = isArabic ? {
    profile: "الملف الشخصي",
    generalInfo: "المعلومات العامة",
    security: "الأمان",
    profilePhoto: "صورة الملف الشخصي",
    uploadPhoto: "رفع صورة",
    removePhoto: "إزالة الصورة",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    username: "اسم المستخدم",
    role: "الدور",
    branch: "الفرع",
    department: "القسم",
    changePassword: "تغيير كلمة المرور",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    updateProfile: "تحديث الملف الشخصي",
    updatePassword: "تحديث كلمة المرور",
    cancel: "إلغاء",
    successUpdate: "تم تحديث الملف الشخصي بنجاح",
    successPassword: "تم تحديث كلمة المرور بنجاح",
    errorPasswordMatch: "كلمات المرور الجديدة غير متطابقة",
    errorPasswordLength: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل",
    accountInfo: "معلومات الحساب",
    memberSince: "عضو منذ",
    lastLogin: "آخر تسجيل دخول"
  } : {
    profile: "Profile",
    generalInfo: "General Information",
    security: "Security",
    profilePhoto: "Profile Photo",
    uploadPhoto: "Upload Photo",
    removePhoto: "Remove Photo",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    username: "Username",
    role: "Role",
    branch: "Branch",
    department: "Department",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updateProfile: "Update Profile",
    updatePassword: "Update Password",
    cancel: "Cancel",
    successUpdate: "Profile updated successfully",
    successPassword: "Password updated successfully",
    errorPasswordMatch: "New passwords do not match",
    errorPasswordLength: "New password must be at least 6 characters",
    accountInfo: "Account Information",
    memberSince: "Member Since",
    lastLogin: "Last Login"
  };

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        username: currentUser.username || '',
        role: currentUser.role || '',
        branch: currentUser.branch || '',
        department: currentUser.department || '',
        profileImage: currentUser.profileImage || ''
      });
      if (currentUser.profileImage) {
        setPreviewImage(currentUser.profileImage);
      }
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewImage(null);
    setProfileData(prev => ({
      ...prev,
      profileImage: ''
    }));
  };

  const showToast = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await authAPI.updateProfile({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        branch: profileData.branch,
        department: profileData.department,
        profileImage: profileData.profileImage
      });
      
      if (data.status === 'success') {
        onUpdateProfile(data.data);
        showToast(t.successUpdate);
      } else {
        showToast(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showToast(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast(t.errorPasswordMatch);
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showToast(t.errorPasswordLength);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const data = await authAPI.updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (data.status === 'success') {
        showToast(t.successPassword);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showToast(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Password update error:', error);
      showToast(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">{t.profile}</h1>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            <h3 className="profile-user-name">{profileData.fullName || 'User Name'}</h3>
            <p className="profile-user-role">{profileData.role || 'Role'}</p>
          </div>

          <div className="profile-tabs">
            <button 
              className={`profile-tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <span className="tab-icon">👤</span>
              {t.generalInfo}
            </button>
            <button 
              className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="tab-icon">🔒</span>
              {t.security}
            </button>
          </div>
        </div>

        <div className="profile-main">
          {activeTab === 'general' && (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="profile-section">
                <h2 className="profile-section-title">{t.profilePhoto}</h2>
                <div className="profile-photo-upload">
                  <div className="profile-photo-preview">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="photo-preview-img" />
                    ) : (
                      <div className="photo-preview-placeholder">
                        {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <div className="profile-photo-actions">
                    <label htmlFor="photo-upload" className="photo-upload-btn">
                      📷 {t.uploadPhoto}
                    </label>
                    <input 
                      type="file" 
                      id="photo-upload" 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                    {previewImage && (
                      <button 
                        type="button" 
                        className="photo-remove-btn"
                        onClick={handleRemovePhoto}
                      >
                        🗑️ {t.removePhoto}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h2 className="profile-section-title">{t.accountInfo}</h2>
                <div className="profile-form-grid">
                  <div className="profile-form-field">
                    <label className="profile-label">{t.fullName}</label>
                    <input 
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  </div>

                  <div className="profile-form-field">
                    <label className="profile-label">{t.email}</label>
                    <input 
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  </div>

                  <div className="profile-form-field">
                    <label className="profile-label">{t.phone}</label>
                    <input 
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  </div>

                  <div className="profile-form-field">
                    <label className="profile-label">{t.username}</label>
                    <input 
                      type="text"
                      name="username"
                      value={profileData.username}
                      className="profile-input"
                      disabled
                    />
                  </div>

                  <div className="profile-form-field">
                    <label className="profile-label">{t.branch}</label>
                    <input 
                      type="text"
                      name="branch"
                      value={profileData.branch}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  </div>

                  <div className="profile-form-field">
                    <label className="profile-label">{t.department}</label>
                    <input 
                      type="text"
                      name="department"
                      value={profileData.department}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  </div>

                  <div className="profile-form-field">
                    <label className="profile-label">{t.role}</label>
                    <input 
                      type="text"
                      value={profileData.role}
                      className="profile-input"
                      disabled
                    />
                  </div>

                  <div className="profile-form-field">
                    <label className="profile-label">{t.memberSince}</label>
                    <input 
                      type="text"
                      value={formatDate(currentUser?.createdAt)}
                      className="profile-input"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="profile-form-actions">
                <button 
                  type="submit" 
                  className="profile-save-btn"
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ Updating...' : `💾 ${t.updateProfile}`}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleUpdatePassword} className="profile-form">
              <div className="profile-section">
                <h2 className="profile-section-title">{t.changePassword}</h2>
                <div className="profile-form-grid">
                  <div className="profile-form-field profile-form-field-full">
                    <label className="profile-label">{t.currentPassword}</label>
                    <input 
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="profile-input"
                      required
                    />
                  </div>

                  <div className="profile-form-field">
                    <label className="profile-label">{t.newPassword}</label>
                    <input 
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="profile-input"
                      required
                      minLength="6"
                    />
                  </div>

                  <div className="profile-form-field">
                    <label className="profile-label">{t.confirmPassword}</label>
                    <input 
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="profile-input"
                      required
                      minLength="6"
                    />
                  </div>
                </div>
              </div>

              <div className="profile-form-actions">
                <button 
                  type="submit" 
                  className="profile-save-btn"
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ Updating...' : `🔒 ${t.updatePassword}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showSuccessToast && (
        <div className="toast-notification toast-show toast-success">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

