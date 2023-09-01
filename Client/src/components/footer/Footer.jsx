import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          {/* <div className="item">
            <h2>Categories</h2>
            <span>Graphics & Design</span>
            <span>Digital Marketing</span>
            <span>Writing & Translation</span>
            <span>video & Animation</span>
            <span>Music & Audio</span>
            <span>Programming & Tech</span>
            <span>Data</span>
            <span>Business</span>
            <span>Lifestyle</span>
            <span>Photography</span>
            <span>Sitemap</span>
          </div> */}
          <div className="item">
            <h2>QUICK LINKS</h2>
            <span>Profile</span>
            <span>Gigs</span>
            <span>Orders</span>
            <span>Wallet</span>
            {/* <span>Music & Audio</span>
            <span>Programming & Tech</span>
            <span>Data</span>
            <span>Business</span>
            <span>Lifestyle</span>
            <span>Photography</span>
            <span>Sitemap</span> */}
          </div>
          <div className="item">
            <h2>ACCOUNT</h2>
            <span>My account</span>
            <span>Order tracking</span>
            <span>Gigs</span>
            {/* <span>video & Animation</span>
            <span>Music & Audio</span>
            <span>Programming & Tech</span>
            <span>Data</span>
            <span>Business</span>
            <span>Lifestyle</span>
            <span>Photography</span>
            <span>Sitemap</span> */}
          </div>
          <div className="item">
            <h2>CONTACT US</h2>
            <span>Facebook</span>
            <span>Instagram</span>
            <span>Twitter</span>
            {/* <span>video & Animation</span>
            <span>Music & Audio</span>
            <span>Programming & Tech</span>
            <span>Data</span>
            <span>Business</span>
            <span>Lifestyle</span>
            <span>Photography</span>
            <span>Sitemap</span> */}
          </div>
          <div className="item">
            <h2>HAVE A QUESTION?</h2>
            <span>203 Fake St. Mountain View, Bangaluru,<br /> karnataka, India</span>
            <span>+91-7907938758</span>
            <span>gigconnectofficial@gmail.com</span>
            {/* <span>video & Animation</span>
            <span>Music & Audio</span>
            <span>Programming & Tech</span>
            <span>Data</span>
            <span>Business</span>
            <span>Lifestyle</span>
            <span>Photography</span>
            <span>Sitemap</span> */}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <h2>GigConnect</h2>
            <span>© GigConnect International Ltd. 2023</span>
          </div>
          <div className="right">
            <div className="social">
              <img src="../../../public/img/twitter.png" alt="" />
              <img src="../../../public/img/facebook.png" alt="" />
              <img src="../../../public/img/linkedin.png" alt="" />
              <img src="../../../public/img/pinterest.png" alt="" />
              <img src="../../../public/img/instagram.png" alt="" />
            </div>
            <div className="link">
              <img src="../../../public/img/language.png" alt="" />
              <span>English</span>
            </div>
            <div className="link">
              <img src="../../../public/img/coin.png" alt="" />
              <span>USD</span>
            </div>
            <img src="../../../public/img/accessibility.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
