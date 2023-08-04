import React from "react";
import { Link } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser.js";
import "./MyGigs.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest.js";

function MyGigs() {
  const currentUser = getCurrentUser();

  // used for updating the review of each user given
  const queryClient = useQueryClient();

  // @tanstack/react-query gig data fetching
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser.id}`).then((res) => {
        return res.data;
      }),
  });

  // mutations are typically used to create/update/delete data or perform server side-effects
  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gigs/${id}`, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]) // used to update the review on the review page
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  }

  return (
    <div className="myGigs">
      {isLoading ? ("Loading...") : error ? ("Something went wrong!") : (<div className="container">
        <div className="title">
          <h1>Gigs</h1>
          {currentUser.isSeller && (
            <Link to="/add">
              <button>Add New Gig</button>
            </Link>
          )}
        </div>
        <table>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Sales</th>
            <th>Action</th>
          </tr>
          {data.map((gig) => (
            <tr key={gig._id}>
              <td>
                <img
                  className="image"
                  src={gig.cover}
                  alt=""
                />
              </td>
              <td>{gig.title}</td>
              <td>
                {gig.price}
              </td>
              <td>{gig.sales}</td>
              <td>
                <img className="delete" src="./img/delete.png" alt="" onClick={() => handleDelete(gig._id)} />
              </td>
            </tr>
          ))
          }
        </table>
      </div>)}
    </div>
  );
}

export default MyGigs;
