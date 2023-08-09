import React, { useState } from "react";
import Review from "../review/Review";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Reviews.scss";
import { useParams } from "react-router-dom";

const Reviews = ({ gigId }) => {
  const [err, setErr] = useState(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();

  // reviews after payment only thats why this fetching
  const { data: dataOrder } = useQuery({
    queryKey: ["orders", id],
    queryFn: () =>
      newRequest.get(`/orders/${id}`).then((res) => {
        return res.data;
      }),
  });

  const isCompleted = dataOrder?.isCompleted || false; // if isCompleted = true then only the review section will display

  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
    },
    onError: (error) => {
      setErr(error.response.data);
      setIsErrorVisible(true);
      setTimeout(() => {
        setIsErrorVisible(false);
      }, 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value;
    const star = e.target[1].value;
    mutation.mutate({ gigId, desc, star });
  };

  return (
    <div className="reviews">
      <h2
        className={isCompleted ? "reviews-heading" : "reviews-heading-inactive"}
      >
        {isCompleted
          ? "Reviews"
          : "Drop your valuable reviews after the payment..."}
      </h2>{" "}
      {isLoading
        ? "Loading..."
        : error
          ? "Something went wrong"
          : data.map((review) => <Review key={review._id} review={review} />)}
      {isCompleted && (
        <div className="add">
          <h3>Add a review</h3>
          <form action="" className="addForm" onSubmit={handleSubmit}>
            <input type="text" placeholder="Write your opinion" />
            <span className={`error ${isErrorVisible ? "visible" : ""}`}>
              {err ===
                "Review validation failed: desc: Path `desc` is required."
                ? "Please fill the required field"
                : err}
            </span>
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
      )}
    </div>
  );
};

export default Reviews;
