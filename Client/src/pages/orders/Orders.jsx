import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest.js";
import "./Orders.scss";
import { useNavigate } from "react-router-dom";
import { IconButton, Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        console.log(res.data, "orders");
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

  const handleCancel = (order) => {
    setSelectedOrder(order);
    setCancelConfirmation(true);
  };

  const handleCancelConfirmed =async () => {
    setCancelConfirmation(false);
    if (selectedOrder) {
      console.log("Cancelling order:", selectedOrder._id);
      // Perform the cancel action here
      const response = await newRequest.get(`/orders/wallet/${selectedOrder._id}`, selectedOrder._id);
      const price = response.data.price
      console.log(price, "price")
      // const priceData = await response.json();

      // Navigating to wallet page with price as a query parameter
      
    }
  };

  return (
    <div className="orders">
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
                <th>{currentUser?.isSeller ? "Action" : "Status"}</th>
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
                      ? data.sellers.find((seller) => seller._id === order.sellerId)?.username
                      : data.buyers.find((buyer) => buyer._id === order.buyerId)?.username}
                  </td>
                  <td>
                    {currentUser.isSeller ? (
                       <Stack direction="row" spacing={1}>
                       <IconButton aria-label="accept" color="success">
                         <CheckCircle />
                       </IconButton>
                       <IconButton aria-label="cancel" color="error" onClick={() => handleCancel(order, true)}> 
                         <Cancel />
                       </IconButton>
                     </Stack>
                    ) : (
                      "Pending"
                    )}
                  </td>
                  <td>${order.price}</td>
                  <td>
                    <img
                      className="message"
                      src="./img/message.png"
                      alt=""
                      onClick={() => handleContact(order)}
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
            <Button onClick={() => setCancelConfirmation(false)} color="primary">
              No
            </Button>
            <Button onClick={handleCancelConfirmed} color="error">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Orders;
