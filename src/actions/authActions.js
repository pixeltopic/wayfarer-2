import server from "../api/server";

import { AUTH_USER, AUTH_ERROR, AUTH_ERROR_RESET, AUTH_REFRESHING_TOKEN } from "./types";

export const signup = ({ email, password }, callback=null, callbackError=null) => async dispatch => {
  // accepts an email and password; signs up/authenticates user and updates global state w/ token if valid.
  // If invalid (eg. email already used) sends an error message to the `error` reducer
  try {
    const response = await server.post(`/api/signup`, { email, password });
    dispatch({ type: AUTH_USER, payload: response.data.token });
    dispatch({ type: AUTH_ERROR, payload: "" });
    localStorage.setItem("token", response.data.token);

    if (callback) callback();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.message : null;
    dispatch({ type: AUTH_ERROR, payload: payload || "There was an error with the server." });

    if (callbackError) callbackError();
  }
}

export const signin = ({ email, password }, callback=null, callbackError=null) => async dispatch => {
  // accepts an email and password; authenticates user and updates global state w/ token if valid.
  // If invalid (eg. email already used) sends an error message to the `error` reducer
  try {
    const response = await server.post(`/api/signin`, { email, password }, { handlerEnabled: false });
    dispatch({ type: AUTH_USER, payload: response.data.token });
    dispatch({ type: AUTH_ERROR, payload: "" });
    localStorage.setItem("token", response.data.token);

    if (callback) callback();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.message : "There was an error with the server.";
    dispatch({ type: AUTH_ERROR, payload: payload || "Your credentials are invalid." });

    if (callbackError) callbackError();
  }
}

export const signout = () => {
  localStorage.clear();
  return { 
    type: AUTH_USER, 
    payload: "" 
  };
}

export const resetAuthMessage = () => {
  // resets the authMessage error in the `error` global state. Useful when unmounting the Signin/Signup components.
  return { type: AUTH_ERROR_RESET };
}

export const updateToken = token => dispatch => {
  localStorage.setItem("token", token);
  dispatch({ type: AUTH_USER, payload: token }); 
  console.log("Token updated.");
}

export const refreshToken = () => async (dispatch, getState) => {
  // attempts to refresh a token with current user's token and updates global state accordingly.
  try {

    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };
    dispatch({ type: AUTH_REFRESHING_TOKEN, payload: true });

    const response = await server.post("/api/refreshtoken", null, getState().auth.authenticated ? config : null);

    if (response.data && response.data.token)
      dispatch(updateToken(response.data.token));
    else
      dispatch(updateToken(""));

    dispatch({ type: AUTH_REFRESHING_TOKEN, payload: false });

  } catch(e) {
    console.log(e);
  }
}