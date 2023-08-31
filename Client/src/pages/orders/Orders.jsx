import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest.js";
import "./Orders.scss";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Alert,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [acceptConfirmation, setAcceptConfirmation] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [alertMessage, setAlertMessage] = useState(""); // State to store the alert message
  const [alertType, setAlertType] = useState(""); // State to store the alert type

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        console.log(res.data.orders[0].status, "orders");
        const status = res.data.orders[0].status;
        return res.data;
      }),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;
    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  const handleAccept = (order) => {
    console.log(order._id,"order accept id")
    setSelectedOrder(order);
    setAcceptConfirmation(true);

  }

  const handleCancel = (order) => {
    setSelectedOrder(order);
    setCancelConfirmation(true);
  };

  const handleCancelConfirmed = async () => {
    setCancelConfirmation(false);
    if (selectedOrder) {
      console.log("Cancelling order:", selectedOrder._id);
      try {
        const response = await newRequest.get(
          `/orders/wallet/${selectedOrder._id}`,
          selectedOrder._id
        );

        console.log(response.data, "response");

        // Update the alert state with the response message and type
        setAlertMessage("Order Cancelled Success");
        setAlertType("success");

        // Navigating to wallet page with price as a query parameter
      } catch (error) {
        // Update the alert state with an error message and type
        setAlertMessage("An error occurred");
        setAlertType("error");
      }
    }
  };

  

  const handleAcceptConfirmed = async () => {
    setAcceptConfirmation(false);
    console.log("acceptance")
    if (selectedOrder) {
      console.log("Cancelling order:", selectedOrder._id);
      try {
         
        const response = await newRequest.get(
          `/orders/accept/${selectedOrder._id}`,
          selectedOrder._id
        );

        console.log(response.data, "response");

        // // Update the alert state with the response message and type
        setAlertMessage("Order Acceptance Success");
        setAlertType("success");

        // Navigating to wallet page with price as a query parameter
      } catch (error) {
        // Update the alert state with an error message and type
        setAlertMessage("An error occurred");
        setAlertType("error");
      }
    }
  };

  return (
    <div className="orders">
      {alertMessage && (
        <Alert
          severity={alertType} // Set the severity based on the alert type
          onClose={() => setAlertMessage("")} // Clear the alert message
          sx={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
            zIndex: 9999,
          }}
        >
          {alertMessage}
        </Alert>
      )}
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>{!currentUser?.isSeller ? "Seller Name" : "Buyer Name"}</th>
                <th>{currentUser?.isSeller ? "Action" : "Order Status"}</th>
                {currentUser?.isSeller && <th>Order Status</th>}
                <th>Price</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img className="image" src={order.img} alt="" />
                  </td>
                  <td>{order.title}</td>
                  <td>
                    {!currentUser.isSeller
                      ? data.sellers.find(
                          (seller) => seller._id === order.sellerId
                        )?.username
                      : data.buyers.find((buyer) => buyer._id === order.buyerId)
                          ?.username}
                  </td>
                  <td>
                    {currentUser.isSeller ? (
                      <Stack direction="row" spacing={1}>
                        <IconButton aria-label="accept" color="success" onClick={()=>handleAccept(order,)}>
                          <CheckCircle />
                        </IconButton>
                        <IconButton
                          aria-label="cancel"
                          color="error"
                          onClick={() => handleCancel(order, true)}
                        >
                          <Cancel />
                        </IconButton>
                      </Stack>
                    ) : (
                      order.status
                    )}
                  </td>
                  {currentUser?.isSeller && <td>{order.status}</td>}
                  <td>${order.price}</td>
                  <td>
                    <img
                      className="message"
                      src="./img/message.png"
                      alt=""
                      onClick={() => handleContact(order, true)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {cancelConfirmation && (
        <Dialog
          open={cancelConfirmation}
          onClose={() => setCancelConfirmation(false)}
        >
          <DialogTitle>Confirm Cancellation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to cancel this Work?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setCancelConfirmation(false)}
              color="primary"
            >
              No
            </Button>
            <Button onClick={handleCancelConfirmed} color="error">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {acceptConfirmation && (
        <Dialog
          open={acceptConfirmation}
          onClose={() => setAcceptConfirmation(false)}
        >
          <DialogTitle>Confirm Acceptance</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to accept this Work?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setAcceptConfirmation(false)}
              color="primary"
            >
              No
            </Button>
            <Button onClick={handleAcceptConfirmed} color="error">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Orders;
