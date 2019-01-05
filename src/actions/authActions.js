import server from "../api/server";

import { AUTH_USER, AUTH_ERROR, AUTH_ERROR_RESET } from "./types";

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
    const payload = e.response ? e.response.data.error : null;
    dispatch({ type: AUTH_ERROR, payload: payload || "There was an error with the server." });

    if (callbackError) callbackError();
  }
}

export const signin = ({ email, password }, callback=null, callbackError=null) => async dispatch => {
  // accepts an email and password; authenticates user and updates global state w/ token if valid.
  // If invalid (eg. email already used) sends an error message to the `error` reducer
  try {
    const response = await server.post(`/api/signin`, { email, password });
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
    if (response.data && response.data.refreshedToken !== undefined) {
      // if undefined, means property was not included in the response.data, so token is still valid. So do nothing.
      // if "", token is no longer valid for refreshing, do nothing. Instead show proper error message on component (or sign them out and send them to login autoamtically)
      // if "sometoken...", token has been refreshed, update global state with it.
      if (response.data.refreshedToken !== "") {
        localStorage.setItem("token", response.data.refreshedToken);
        dispatch({ type: AUTH_USER, payload: response.data.refreshedToken }); 
        console.log("Token updated successfully");
      }

    }

  }
}

export const refreshToken = () => async (dispatch, getState) => {
  // attempts to refresh a token with current user's token and updates global state accordingly.
  try {

    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };
    
    const response = await server.post("/api/refreshtoken", null, getState().auth.authenticated ? config : null);

    await dispatch(updateToken(response));

  } catch(e) {
    console.log(e);
  }
}