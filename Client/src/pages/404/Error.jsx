import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Error.scss';

const Error404 = () => {
  useEffect(() => {
    setTimeout(() => {
      const lever = document.querySelector('.js-toaster_lever');
      const toast = document.querySelector('.js-toaster_toast');

      if (lever) {
        lever.style.top = '30px';
        if (toast) {
          toast.classList.remove('js-ag-hide');
          toast.classList.add('js-ag-animated', 'js-ag-bounce-in-up');
        }
      }
    }, 800);
  }, []);

  return (
    <div className="ag-page-404">
      <div className="centered-container">
        <h2 className="not-found-text">Oops! Page Not Found</h2>
        <Link to={"/"}>
        <button className="back-button">Go Back</button>
        </Link>
      </div>

      <div className="ag-toaster-wrap">
        <div className="ag-toaster">
          <div className="ag-toaster_back"></div>
          <div className="ag-toaster_front">
            <div className="js-toaster_lever ag-toaster_lever"></div>
          </div>
          <div className="ag-toaster_toast-handler">
            <div className="ag-toaster_shadow"></div>
            <div className="js-toaster_toast ag-toaster_toast js-ag-hide"></div>
          </div>
        </div>
        <canvas id="canvas-404" className="ag-canvas-404"></canvas>
        <img
          className="ag-canvas-404_img"
          src="https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/404-error-smoke-from-toaster/images/smoke.png"
          alt="Smoke"
        />
      </div>
    </div>
  );
};

export default Error404;
