import React from "react";
import { Link } from "react-router-dom";
import "./Messages.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

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

  return (
    <div className="messages">
      {isLoading ? ("Loading...") : error ? ("Something went wrong!") : (<div className="container">
        <div className="title">
          <h1>Messages</h1>
        </div>
        <table>
          <tr>
            <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
            <th>Last Message</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
          {data.map((c) => (
            <tr className="active" key={c.id} >
              <td>Charley Sharp</td>
              <td>
                <Link to="/message/123" className="link">
                  {c.desc.substring(0, 100)}...
                </Link>
              </td>
              <td>{}</td>
              <td>
                <button>Mark as Read</button>
              </td>
            </tr>
          ))}
        </table>
      </div>)}
    </div>
  );
};

export default Messages;