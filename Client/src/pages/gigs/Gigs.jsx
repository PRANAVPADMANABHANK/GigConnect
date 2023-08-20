import React, { useState, useRef, useEffect } from "react";
import GigCard from "../../components/gigCard/GigCard";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import getCurrentUser from "../../utils/getCurrentUser";
import "./Gigs.scss";

const Gigs = () => {
  const [sort, setSort] = useState("sales"); //for changing the selected sortBy in the page
  const [open, setOpen] = useState(false); //for sortBy dropdown state change
  const minRef = useRef();
  const maxRef = useRef();
  const navigate = useNavigate();
  const { search } = useLocation();

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate])


  // @tanstack/react-query data fetching
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  // whenever the sort changes (like newest / bestselling ) refetch the gigs
  useEffect(() => {
    refetch();
  }, [sort]);

  // whenever the apply happen refetch the gigs
  const apply = () => {
    refetch();
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">
          GIG CONNECT {">"} GRAPHICS & DESIGN {">"}
        </span>
        <h1>AI Artists</h1>
        <p>
          Explore the boundaries of art and technology with GigConnect AI
          artists
        </p>
        <div className="menu">
          <div className="left">
            <span>Budged</span>
            <input ref={minRef} type="text" placeholder="min" />
            <input ref={maxRef} type="text" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort By</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img
              src="../../../public/img/down.png"
              alt=""
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "Loading..."
            : error
              ? "Something went wrong"
              : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
};

export default Gigs;
