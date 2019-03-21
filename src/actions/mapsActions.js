import server from "../api/server";
import { updateToken } from "./authActions";
import { formCache } from "./formActions";
import { formNames } from "../utils";

import { FETCH_DIRECTIONS } from "./types";

export const fetchDirections = (searchProps, callbackFinal=null, callbackError=null, callbackInitial=null) => async (dispatch, getState) => {
  // fetches directions from google maps api. Sends current JWT if user is logged in for possible refresh.
  try {

    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };
    
    const response = await server.post("/api/fetchdirections", searchProps, getState().auth.authenticated ? config : null);

    if (callbackInitial) callbackInitial();
    
    dispatch({ type: FETCH_DIRECTIONS, payload: response.data });
    if (response.data.directions && response.data.directions.origin && 
      response.data.directions.destination && getState().form[formNames.SEARCH_ROUTE_FORM]) {

      dispatch(formCache(formNames.SEARCH_ROUTE_FORM, { 
        ...getState().form[formNames.SEARCH_ROUTE_FORM], 
        origin: response.data.directions.origin, 
        destination: response.data.directions.destination 
      }));
    }
    dispatch(updateToken(response));

    if (callbackFinal) callbackFinal();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.error : null;
    if (callbackError) callbackError(payload || "There was an error with the server.");
  }
}