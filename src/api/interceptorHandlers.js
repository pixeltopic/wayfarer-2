import store from "../store";
import { updateToken } from "../actions";
import { AUTH_REFRESHING_TOKEN, AUTH_REFRESHING_CALL } from "../actions/types";
import server from "./server";

/**
 * @param {object} config - object possibly containing the `handlerEnabled` key. If false, will not be handled by the interceptor. 
 */
const isHandlerEnabled = (config = {}) => {
  return config.hasOwnProperty("handlerEnabled") && !config.handlerEnabled
    ? false
    : true;
};

/**
 * Using the current token in the redux store, attempt to refresh token.
 * Ensures that only one call to api/refreshtoken can be made at once by storing the current promise within the store.
 * @returns {Promise} refreshingCall - a promise (that may or may not be resolved) to api/refreshtoken. At most one unique api/refreshtoken promise can exist at once.
 */
const handlerRefreshToken = () =>  {
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

  } catch(error) {
    console.log(error);
    return Promise.reject(error);
  }
}

export const successHandler = response => response;

export const errorHandler = error => {

  const statusCode = error.response ? error.response.status : null;
  const originalRequest = error.config;

  if (!isHandlerEnabled(originalRequest)) {
    console.log("Handler disabled for this response.");
    return Promise.reject(error);
  }

  // handlerRefreshToken will always return at most one unique promise to api/refreshtoken. 
  // Any failed calls block until it resolves, then accesses then .then chain with the new token.
  if (statusCode === 401) {
    console.log("Refreshing token in interceptor.");
    return handlerRefreshToken().then(_ => {
      const refreshedToken = store.getState().auth.authenticated;
      originalRequest.headers["authorization"] = refreshedToken;
      originalRequest.baseURL = undefined;
      return server.request(originalRequest);
    });
  }

  return Promise.reject(error);
};
