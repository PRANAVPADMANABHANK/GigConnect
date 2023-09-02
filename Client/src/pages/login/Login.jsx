import React from "react";
import { useState } from "react";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from "react-google-login";
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

  const responseSuccessGoogle = (response) => {
    console.log(response);
  };

  const responseErrorGoogle = (response) => {};

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
        <Link to="/forgot-password">
          <h3 className="forgot-password">Forgot Password</h3>
        </Link>
        <button type="submit">Sign in</button>
        <span>{error && error}</span>
      </form>
      <div style={{ display: 'inline-block', marginTop: "500px",  marginLeft: '-270px' }}>
        <GoogleLogin
          clientId="216708628570-soob9k2ln46nd1bc3v33rstpbhjec2af.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          onSuccess={responseSuccessGoogle}
          onFailure={responseErrorGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </div>
    </div>
  );
};

export default Login;
