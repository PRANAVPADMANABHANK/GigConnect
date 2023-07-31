import React from "react";
import "./Review.scss";

const Review = () => {
  return (
    <div className="review">
        <div className="user">
          <img
            className="pp"
            src="https://images.pexels.com/photos/839586/pexels-photo-839586.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
          />
          <div className="info">
            <span>Garner David</span>
            <div className="country">
              <img
                src="https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png"
                alt=""
              />
              <span>United States</span>
            </div>
          </div>
        </div>
        <div className="stars">
          <img src="/img/star.png" alt="" />
          <img src="/img/star.png" alt="" />
          <img src="/img/star.png" alt="" />
          <img src="/img/star.png" alt="" />
          <img src="/img/star.png" alt="" />
          <span>5</span>
        </div>
        <p>
          I just want to say that art_with_ai was the first, and after this, the
          only artist Ill be using on Fiverr. Communication was amazing, each
          and every day he sent me images that I was free to request changes to.
          They listened, understood, and delivered above and beyond my
          expectations. I absolutely recommend this gig, and know already that
          Ill be using it again very very soon
        </p>
        <div className="helpful">
          <span>Helpful?</span>
          <img src="/img/like.png" alt="" />
          <span>Yes</span>
          <img src="/img/dislike.png" alt="" />
          <span>No</span>
        </div>
      </div>
  );
};

export default Review;
