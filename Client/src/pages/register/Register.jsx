import React, { useState } from "react";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import "./Register.scss";

const Register = () => {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log(file,"file")
    const url = await upload(file);
    console.log("kkkkkk")
    console.log(url,"url")

    try {
      await newRequest.post("auth/register", {
        ...user,
        img: url,
      });
      navigate("/login");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="">Username</label>
          <input
            name="username"
            type="text"
            placeholder="username"
            onChange={handleChange}
          />
          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <label htmlFor="">Password</label>
          <input
            name="password"
            type="password"
            placeholder="password"
            onChange={handleChange}
          />
          <label htmlFor="">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="">Country</label>
          <input
            name="country"
            type="text"
            placeholder="country"
            onChange={handleChange}
          />
          {/* Loading effect for the register button */}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="">Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+1 234 567 89"
            onChange={handleChange}
          />
          <label htmlFor="">Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default Register;
