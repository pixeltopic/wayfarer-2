import server from "../api/server";
import { updateToken } from "./authActions";

import { FETCH_PLACES, FETCH_PLACE_DETAILS, FETCH_MORE_PLACES } from "./types";

export const fetchPlaces = (searchProps, callback=null, callbackError=null) => async (dispatch, getState) => {
  // fetches directions from google maps api. Sends current JWT if user is logged in for possible refresh.
  try {

    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };
    
    const response = await server.post("/api/fetchplaces", searchProps, getState().auth.authenticated ? config : null);

    dispatch({ type: FETCH_PLACES, payload: response.data });
    dispatch(updateToken(response));

    if (callback) callback();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.error : null;
    if (callbackError) callbackError(payload || "There was an error with the server.");
  }
}

export const fetchMorePlaces = (callback=null, callbackError=null) => async (dispatch, getState) => {
  try {
    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };

    if (getState().places.next_page_token) {
      const response = await server.post("/api/fetchplaces", { next_page_token: getState().places.next_page_token }, getState().auth.authenticated ? config : null);
      dispatch({ type: FETCH_MORE_PLACES, payload: response.data });
      dispatch(updateToken(response));
    }

    if (callback) callback();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.error : null;
    if (callbackError) callbackError(payload || "There was an error with the server.");
  }
}

export const fetchPlaceDetails = (place_id, callback=null, callbackError=null) => async (dispatch, getState) => {
  try {

    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };

    if (place_id === getState().places.cachedPlaceDetailsId) {
      console.log("Memoized place details loaded");
      if (callback) callback();
      return;
    }

    const response = await server.post("/api/fetchplacedetails", { place_id }, getState().auth.authenticated ? config : null);

    dispatch({ type: FETCH_PLACE_DETAILS, payload: response.data });
    dispatch(updateToken(response));

    if (callback) callback();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.error : null;
    if (callbackError) callbackError(payload || "There was an error with the server.");
  }
}