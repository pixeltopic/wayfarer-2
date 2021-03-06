import server from "../api/server";
import { formCache } from "./formActions";
import { formNames } from "../utils";

import { FETCH_PLACES, FETCH_PLACE_DETAILS, FETCH_MORE_PLACES } from "./types";

export const fetchPlaces = (searchProps, callback=null, callbackError=null) => async (dispatch, getState) => {
  // fetches directions from google maps api. Sends current JWT if user is logged in for possible refresh.
  try {

    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };
    
    const response = await server.post("/api/places", searchProps, getState().auth.authenticated ? config : null);

    dispatch({ type: FETCH_PLACES, payload: response.data });
    if (response.data.places && response.data.places.address && getState().form[formNames.SEARCH_PLACE_FORM]) {
      dispatch(formCache(formNames.SEARCH_PLACE_FORM, { ...getState().form[formNames.SEARCH_PLACE_FORM], address: response.data.places.address }));
    }

    if (callback) callback();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.message : null;
    if (callbackError) callbackError(payload || "There was an error with the server.");
  }
}

export const fetchMorePlaces = (callback=null, callbackError=null) => async (dispatch, getState) => {
  try {
    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };

    if (getState().places.nextPageToken) {
      const response = await server.post("/api/places/token", { nextPageToken: getState().places.nextPageToken }, getState().auth.authenticated ? config : null);
      dispatch({ type: FETCH_MORE_PLACES, payload: response.data });
    }

    if (callback) callback();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.message : null;
    if (callbackError) callbackError(payload || "There was an error with the server.");
  }
}

export const fetchPlaceDetails = (place_id, callback=null, callbackError=null) => async (dispatch, getState) => {
  try {

    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };

    if (place_id === getState().places.cachedPlaceDetailsId) {
      console.log("Cached place details loaded");
      if (callback) callback();
      return;
    }

    const response = await server.post("/api/places/details", { place_id }, getState().auth.authenticated ? config : null);

    dispatch({ type: FETCH_PLACE_DETAILS, payload: response.data });

    if (callback) callback();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.message : null;
    if (callbackError) callbackError(payload || "There was an error with the server.");
  }
}