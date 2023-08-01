import React from "react";
import { useState } from "react";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); //to prevent the refreshing of the page
    try {
      const res = await newRequest.post("auth/login", { username, password }); //post username and password to db using axios library. And axios is set in a common file called "newRequest". "res" is in the form of object.
      localStorage.setItem("currentUser", JSON.stringify(res.data)); // here storaging logged in user details to the localStorage. localStorage can store only string format
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="">Username</label>
        <input
          name="username"
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="">Password</label>
        <input
          name="password"
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <span>{error && error}</span>
      </form>
    </div>
  );
};

export default Login;
