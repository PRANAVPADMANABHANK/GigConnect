import React from "react";
import Modal from "react-modal";
import "./EditProfileModal.scss"; // Import modal styles
import EditProfile from "../../pages/editProfile/EditProfile";

const EditProfileModal = ({ isOpen, onRequestClose }) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="edit-profile-modal"
      overlayClassName="edit-profile-modal-overlay"
    >
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <EditProfile />
        <button className="close-button" onClick={onRequestClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
