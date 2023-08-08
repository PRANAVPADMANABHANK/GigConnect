import React from 'react';
import './Profile.scss';

const Profile = () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) // get the currentUser form the localStorage
  
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
            <a className="profile__button" href="#">
              Edit Profile
            </a>
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
    </div>
  );
};

export default Profile;
