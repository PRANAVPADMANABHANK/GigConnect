import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Success.scss";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    const makeRequest = async () => {
      await newRequest.put("/orders", { payment_intent });
      setTimeout(() => {
        navigate("/orders");
      }, 5000);
    };
    makeRequest();
  }, []);
  return (
    <div className="success-message">
      Payment successful. You are being redirected to the orders page.
      <div className="redirect-text">Please do not close the page.</div>
    </div>
  );
};

export default Success;
