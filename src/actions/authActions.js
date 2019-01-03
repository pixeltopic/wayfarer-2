import axios from "axios";

import { AUTH_USER, AUTH_ERROR, AUTH_ERROR_RESET } from "./types";

export const signup = ({ email, password }, callback=null, callbackError=null) => async dispatch => {
  // accepts an email and password; signs up/authenticates user and updates global state w/ token if valid.
  // If invalid (eg. email already used) sends an error message to the `error` reducer
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/signup`, { email, password });
    dispatch({ type: AUTH_USER, payload: response.data.token });
    dispatch({ type: AUTH_ERROR, payload: "" });
    localStorage.setItem("token", response.data.token);

    if (callback) callback();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.error : null;
    dispatch({ type: AUTH_ERROR, payload: payload || "There was an error with the server." });

    if (callbackError) callbackError();
  }
}

export const signin = ({ email, password }, callback=null, callbackError=null) => async dispatch => {
  // accepts an email and password; authenticates user and updates global state w/ token if valid.
  // If invalid (eg. email already used) sends an error message to the `error` reducer
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/signin`, { email, password });
    dispatch({ type: AUTH_USER, payload: response.data.token });
    dispatch({ type: AUTH_ERROR, payload: "" });
    localStorage.setItem("token", response.data.token);

    if (callback) callback();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.error : "There was an error with the server.";
    dispatch({ type: AUTH_ERROR, payload: payload || "Your credentials are invalid." });

    if (callbackError) callbackError();
  }
}

export const signout = () => {
  localStorage.removeItem("token");
  return { 
    type: AUTH_USER, 
    payload: "" 
  };
}

export const resetAuthMessage = () => {
  // resets the authMessage error in the `error` global state. Useful when unmounting the Signin/Signup components.
  return { type: AUTH_ERROR_RESET };
}

export const updateToken = (response, acceptingToken=false) => dispatch => {
  // accepts a response from the server and updates the authenticated token with it if needed.
  // if `acceptingToken` is true, accepts a token string.
  // this is a helper action creator made to be called from other action creators to refresh the token if needed.

  if (acceptingToken) {
    dispatch({ type: AUTH_USER, payload: response });
  } else {
    const token = response.data ? response.data.auth.token : null;

    if (token) {
      dispatch({ type: AUTH_USER, payload: token });
    }
  }
}