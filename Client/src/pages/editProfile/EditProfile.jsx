import React, { useState, useEffect } from "react";

import "./EditProfile.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import newRequest from "../../utils/newRequest";
import upload from "../../utils/upload";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileData, setProfileData] = useState({
    username: "", // Add username here
    description: "",
    email: "",
    country: "",
    phoneNumber: "",
    userType: "",
  });


  const navigate = useNavigate()
  const currentUser = getCurrentUser();
  console.log(currentUser._id,"_id")

  useEffect(() => {
    setProfileData({
      username: currentUser.username || "", // Initialize username
      description: currentUser.desc || "",
      email: currentUser.email || "",
      country: currentUser.country || "",
      phoneNumber: currentUser.phone || "",
      userType: currentUser.isSeller ? "Seller" : "Buyer",
    });
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = await upload(file); // Assuming the upload function returns the image URL
      console.log(url, "url");
      setSelectedImage(url); // Set the selectedImage state to the image URL
    }
  };

  console.log(selectedImage, "selectedImage");
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    const updatedProfileData = {
      _id: currentUser._id,
      username: profileData.username,
      description: profileData.description,
      email: profileData.email,
      country: profileData.country,
      phoneNumber: profileData.phoneNumber,
      userType: profileData.userType,
      image: selectedImage,
    };

    console.log(updatedProfileData, "]]]]]]]]]");
    try {
      const response = await newRequest.put(
        `users/updateProfile`,
        updatedProfileData
      );

      console.log("Profile updated:", response.data);
      localStorage.setItem("currentUser", null);
      navigate("/login")
      // Optionally, display a success message to the user
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle the error, e.g., display an error message to the user
    }
  };

  return (
    <div className="layout">
      <div className="profile">
        <div className="profile__picture">
          <img
            src={
              selectedImage ||
              currentUser?.img ||
              "../../../public/img/noavatar.png"
            }
            alt="Profile"
          />
          <input type="file" accept="" onChange={handleImageChange} />
        </div>
        <div className="profile__header">
          <div className="profile__account">
            <input
              type="text"
              className="profile__username"
              name="username"
              value={profileData.username} // Use profileData.username
              onChange={handleInputChange}
            />
          </div>
          <div className="profile__edit">
            <button
              className="profile__button cta-button"
              onClick={handleSaveProfile}
            >
              Save Profile
            </button>
          </div>
        </div>
        <div className="profile__input" style={{ marginTop: "100px" }}>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter description"
              name="description"
              value={profileData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter country"
              name="country"
              value={profileData.country}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-box">
            <input
              type="tel"
              placeholder="Enter phone number"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter user type"
              name="userType"
              value={profileData.userType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
