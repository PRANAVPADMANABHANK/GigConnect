import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://gigconnect.stepups.live/api/",
  withCredentials: true,
});

export default newRequest;
