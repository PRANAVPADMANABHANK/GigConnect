import React, { useState } from "react";
import Review from "../review/Review";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Reviews.scss";

const Reviews = ({ gigId }) => {
  const [err, setErr] = useState(null);

  // used for updating the review of each user given
  const queryClient = useQueryClient();

  // @tanstack/react-query gig data fetching
  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => {
        return res.data;
      }),
  });

  // mutations are typically used to create/update/delete data or perform server side-effects
  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post('/reviews', review)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]) // used to update the review on the review page
    },
    onError: (error) => {
      setErr(error.response.data); // Store the error message in the state to display it
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value; // fetch desc from input
    const star = e.target[1].value; // fetch stars number from select
    mutation.mutate({ gigId, desc, star }); // pass these values to the mutation function
  };

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {isLoading ? "Loading..." : error ? "Something went wrong" : data.map((review) => <Review key={review._id} review={review} />)}
      <div className="add">
        <h3>Add a review</h3>
        <form action="" className="addForm" onSubmit={handleSubmit}>
          <input type="text" placeholder="Write your opinion" />
          <span>{err === "Review validation failed: desc: Path `desc` is required."?"Please fill the required field": err}</span> {/* Display the error message inside the span */}
          <select name="" id="">
            <option value={1}>1⭐</option>
            <option value={2}>2⭐</option>
            <option value={3}>3⭐</option>
            <option value={4}>4⭐</option>
            <option value={5}>5⭐</option>
          </select>
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
