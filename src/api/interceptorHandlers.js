import store from "../store";
import { updateToken } from "../actions";
import { AUTH_REFRESHING_TOKEN, AUTH_REFRESHING_CALL } from "../actions/types";
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



const refreshToken = () =>  {
  // attempts to refresh a token with current user's token and updates global state accordingly.
  try {

    const config = { 
      headers : { authorization: store.getState().auth.authenticated }  
    };
    

    if (store.getState().auth.refreshingToken) {
      return store.getState().auth.refreshingCall;
    }

    store.dispatch({ type: AUTH_REFRESHING_TOKEN, payload: true });
  
    const refreshingCall = server.post("/api/refreshtoken", null, store.getState().auth.authenticated ? config : null).then(({ data: { token } }) => {
        store.dispatch(updateToken(token || ""));
        store.dispatch({ type: AUTH_REFRESHING_TOKEN, payload: false });
        store.dispatch({ type: AUTH_REFRESHING_CALL, payload: null });
        return Promise.resolve(true);
    });

    store.dispatch({ type: AUTH_REFRESHING_CALL, payload: refreshingCall });
    
    return refreshingCall;

  } catch(e) {
    console.log(e);
  }
}


export const errorHandler = async error => {
  console.log("error handler");

  const statusCode = error.response ? error.response.status : null;
  const originalRequest = error.config;

  if (!isHandlerEnabled(originalRequest)) {
    console.log("Handler disabled for this response");
    return Promise.reject(error);
  }

  if (statusCode === 401) {
    return refreshToken().then(_ => {
      const refreshedToken = store.getState().auth.authenticated;
      originalRequest.headers["authorization"] = refreshedToken;
      originalRequest.baseURL = undefined;
      return server.request(originalRequest);
    });
  }

  return Promise.reject(error);
};
