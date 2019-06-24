import axios from "axios";
import { successHandler, errorHandler } from "./interceptorHandlers";

const server = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    key: process.env.REACT_APP_API_KEY
  }
});

server.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error)
);

export default server;