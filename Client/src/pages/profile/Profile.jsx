import React, { useState } from 'react';
import './Profile.scss';

const ProfileSection = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profilePic, setProfilePic] = useState(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-section">
      <div className="left-panel">
        <div
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </div>
        <div
          className={`tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Password
        </div>
      </div>
      <div className="right-panel">
        <div className="profile-pic-section">
          <div className="profile-pic">
            {profilePic ? (
              <img src={profilePic} alt="Profile" />
            ) : (
              <div className="upload-button">
                <label htmlFor="profilePic">
                  <span>Upload Profile Pic</span>
                  <input
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="details-section">
          {activeTab === 'profile' && (
            <div className="content">
              <h2>Profile Section</h2>
              <div className="info">
                <p><strong>Country:</strong> India</p>
                <p><strong>Username:</strong> hari</p>
                <p><strong>Email:</strong> hari@gmail.com</p>
                <p><strong>Created At:</strong> 2023-07-27</p>
              </div>
            </div>
          )}
          {activeTab === 'password' && (
            <div className="content">
              <h2>Password Section</h2>
              <div className="password-details">
                {/* Password change form can be added here */}
                <p>Change your password here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
