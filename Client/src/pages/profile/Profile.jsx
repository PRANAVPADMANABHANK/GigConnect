import React, { useState } from 'react';
import './Profile.scss';
import EditProfileModal from '../../components/editProfileModal/EditProfileModal';
import Modal from 'react-modal'; // Import the react-modal library

Modal.setAppElement('#root'); // Set the app element for accessibility

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track the modal's open state

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleEditClick = () => {
    if (!isModalOpen) {
      setIsEditing(true);
      setIsModalOpen(true); // Open the modal and set its open state
    }
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setIsModalOpen(false); // Close the modal and set its open state
  };

  return (
    <div className="layout">
      <div className="profile">
        <div className="profile__picture">
          <img src={currentUser?.img || "../../../public/img/noavatar.png"} alt="ananddavis" />
        </div>
        <div className="profile__header">
          <div className="profile__account">
            <h4 className="profile__username">{currentUser?.username || "Nill"}</h4>
          </div>
          <div className="profile__edit">
            <button className="profile__button cta-button" onClick={handleEditClick}>
              Edit Profile
            </button>
          </div>
        </div>
        <div className="profile__input">
          <div className="input-box">
            {currentUser?.desc || <span style={{color: "red"}}>No desc entered</span>}
          </div>
          <div className="input-box">
            {currentUser?.email || <span style={{color: "red"}}>No email entered</span>}
          </div>
          <div className="input-box">
            {currentUser?.country || <span style={{color: "red"}}>No country entered</span>}
          </div>
          <div className="input-box">
            {currentUser?.phone || <span style={{color: "red"}}>No phone number entered</span>}
          </div>
          <div className="input-box">
            {currentUser?.isSeller == true ? "Seller" : currentUser?.isSeller == null ? <span style={{color: "red"}}>User not verified</span> : "Buyer"}
          </div>
        </div>
      </div>

      {isEditing && <EditProfileModal isOpen={isModalOpen} onRequestClose={handleCloseModal} />}
    </div>
  );
};

export default Profile;
