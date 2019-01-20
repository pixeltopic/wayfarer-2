import server from "../api/server";
import { updateToken } from "./authActions";

import { FETCH_PLACES } from "./types";

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