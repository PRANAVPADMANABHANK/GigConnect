import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest.js";
import moment from "moment";
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
  const [acceptConfirmation, setAcceptConfirmation] = useState(false);
  const [submissionConfirmation, setSubmissionConfirmation] = useState(false); // New state for submission confirmation
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [alertMessage, setAlertMessage] = useState(""); // State to store the alert message
  const [alertType, setAlertType] = useState(""); // State to store the alert type
  const [isSubmissionDisabled, setIsSubmissionDisabled] = useState(false); // State to track submission button disabled state

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        console.log(res.data.orders[0], "orders");
        const status = res.data.orders[0].status;
        return res.data;
      }),
  });

  useEffect(() => {
    // Calculate submission button disabled state here
    if (data && data.orders) {
      const isDisabled = data.orders.some((order) => {
        const deliveryDate = moment(order.updatedAt)
          .add(order.deliveryTime, "days")
          .endOf("day"); // Set the end of the day for accurate comparison
        const currentDate = moment().endOf("day"); // Set the end of the day for accurate comparison
        return currentDate.isAfter(deliveryDate);
      });
      setIsSubmissionDisabled(isDisabled);
    }
  }, [data]);

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
    console.log(order._id, "order accept id");
    setSelectedOrder(order);
    setAcceptConfirmation(true);
  };

  const handleCancel = (order) => {
    setSelectedOrder(order);
    setCancelConfirmation(true);
  };

  const handleSubmissionConfirmation = (order) => {
    setSelectedOrder(order);
    setSubmissionConfirmation(true);
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
        setAlertMessage("An error occurred / Already Cancelled.");
        setAlertType("error");
      }
    }
  };

  const handleAcceptConfirmed = async () => {
    setAcceptConfirmation(false);
    console.log("acceptance");
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
        setAlertMessage("An error occurred / Already Accepted.");
        setAlertType("error");
      }
    }
  };

  const handleSubmitWork = async (order) => {
    setSubmissionConfirmation(false);
    console.log(order._id, "submit work");
    try {
      const response = await newRequest.get(`/orders/submission/${order._id}`);
      console.log(response.data, "work submission response");

      // Update the alert state with the response message and type
      setAlertMessage(response.data.message);
      setAlertType("success");
    } catch (error) {
      // Handle errors here and update the alert state accordingly
      setAlertMessage("An error occurred.");
      setAlertType("error");
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
                <th>Delivery Time</th>
                <th>Date</th>
                <th>Revision Number</th>
                <th>Contact</th>
                {!currentUser?.isSeller && <th>Work Progress</th>}
                {currentUser?.isSeller && <th>Submission</th>}
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
                    {!currentUser.isSeller ? order.sellerName : order.buyerName}
                  </td>
                  <td>
                    {currentUser.isSeller ? (
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          aria-label="accept"
                          color="success"
                          onClick={() => handleAccept(order)}
                        >
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
                    {order.deliveryTime === 1
                      ? "1 Day"
                      : `${order.deliveryTime} Days`}
                  </td>
                  <td>{moment(order.updatedAt).fromNow()}</td>
                  <td>{order.revisionNumber} Times</td>

                  <td>
                    <img
                      className="message"
                      src="./img/message.png"
                      alt=""
                      onClick={() => handleContact(order, true)}
                    />
                  </td>
                  {!currentUser?.isSeller && <td
                    style={{
                      color:
                        order.received === "Work received" ? "green" : "red",
                    }}
                  >
                    {order.received}
                  </td>}

                  {currentUser?.isSeller && (
                    <td>
                      {order.status === "Accepted" ? (
                        order.submission === "Work completed" ? (
                          <strong style={{ color: "green" }}>
                            Work Completed
                          </strong>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmissionConfirmation(order)}
                            disabled={isSubmissionDisabled}
                          >
                            Submit Work
                          </Button>
                        )
                      ) : null}
                    </td>
                  )}
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
      {submissionConfirmation && (
        <Dialog
          open={submissionConfirmation}
          onClose={() => setSubmissionConfirmation(false)}
        >
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to submit this work?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setSubmissionConfirmation(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmitWork(selectedOrder)}
              color="primary"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Orders;
