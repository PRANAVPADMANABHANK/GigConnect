import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://gigconnect.stepups.live/api/",
  withCredentials: true,
});

export default newRequest;


// "https://gigconnect.stepups.live/api/"

// "http://localhost:8800/api/"