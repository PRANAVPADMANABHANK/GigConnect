import React from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";
import "./Messages.scss";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // used for updating current task and here it is mark as read
  const queryClient = useQueryClient();

  // @tanstack/react-query data fetching
  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest
        .get(
          `/conversations`
        )
        .then((res) => {
          return res.data;
        }),
  });

  // mutations are typically used to create/update/delete data or perform server side-effects
  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]) // used to update the review on the review page
    },
  });


  const handleRead = (id) => {
    mutation.mutate(id);
  }

  return (
    <div className="messages">
      {isLoading ? ("Loading...") : error ? ("Something went wrong!") : (<div className="container">
        <div className="title">
          <h1>Messages</h1>
        </div>
        <table>
          <tr>
            <th>{currentUser.isSeller ? "Buyer Id" : "Seller Id"}</th>
            <th>Last Message</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
          {data.map((c) => (
            <tr className={((currentUser.isSeller && !c.readBySeller) || (!currentUser.isSeller && !c.readByBuyer)) && "active"} key={c.id} > {/** if the readByBuyer or readBySeller is true shows white in background color and it is false shows green in color */}
              <td>{currentUser.isSeller ? c.buyerId : c.sellerId}</td>
              <td>
                <Link to={`/message/${c.id}`} className="link">
                  {c?.lastMessage?.substring(0, 100)}...
                </Link>
              </td>
              <td>{moment(c.updatedAt).fromNow()}</td>
              <td>
                {((currentUser.isSeller && !c.readBySeller) || (!currentUser.isSeller && !c.readByBuyer)) && (
                  <button onClick={() => handleRead(c.id)}>Mark as Read</button>
                )}
              </td>
            </tr>
          ))}
        </table>
      </div>)}
    </div>
  );
};

export default Messages;