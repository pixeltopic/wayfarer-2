import server from "../api/server";
import { updateToken } from "./authActions";

import { FETCH_INCIDENTS } from "./types";

export const fetchIncidents = (callback=null) => async (dispatch, getState) => {
  try {
    console.log("fetched Incidents");

    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };
    
    const response = await server.post(
      "/api/fetchincidents", 
      getState().maps.routes ? { routes: getState().maps.routes } : null, 
      getState().auth.authenticated ? config : null
    );

    dispatch({ type: FETCH_INCIDENTS, payload: response.data });
    dispatch(updateToken(response));

    if (callback) callback();
    
  } catch(e) {
    console.log(e);
  }
}