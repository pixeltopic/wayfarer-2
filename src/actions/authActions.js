import axios from "axios";

import { AUTH_USER, AUTH_ERROR } from "./types";

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
    dispatch({ type: AUTH_ERROR, payload: e.response.data.error || "There was an error with the server." });

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
    dispatch({ type: AUTH_ERROR, payload: e.response.data.error || "Your credentials are invalid." });

    if (callbackError) callbackError();
  }
}

export const signout = () => {
  localStorage.removeItem("token");
  return { 
    type: "auth_user", 
    payload: "" 
  };
}