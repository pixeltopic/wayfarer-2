import store from "../store";
import { refreshToken } from "../actions";
import server from "./server";

const isHandlerEnabled = (config = {}) => {
  return config.hasOwnProperty("handlerEnabled") && !config.handlerEnabled
    ? false
    : true;
};

export const successHandler = response => {
  console.log("Response success!");
  return response;
};

export const errorHandler = async error => {
  console.log("error handler");

  const statusCode = error.response ? error.response.status : null;
  const originalRequest = error.config;

  if (!isHandlerEnabled(originalRequest)) {
    console.log("Handler disabled for this response");
    return Promise.reject(error);
  }

  if (statusCode === 401) {
    if (!store.getState().auth.refreshingToken) {
      console.log("Attempting to refresh token");
      await store.dispatch(refreshToken());
    }

    const refreshedToken = store.getState().auth.authenticated;

    originalRequest.headers["authorization"] = refreshedToken;
    originalRequest.baseURL = undefined;

    // if (!refreshedToken)
    //   return error;

    return server.request(originalRequest);
  }

  return Promise.reject(error);
};
