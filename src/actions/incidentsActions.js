import server from "../api/server";
import { updateToken } from "./authActions";
import { formNames } from "../utils";

import { FETCH_INCIDENTS } from "./types";

export const fetchIncidents = (callback=null) => async (dispatch, getState) => {
  try {
    console.log("fetched Incidents");

    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };

    const extraParams = {};

    const discoverFormCache = getState().form[formNames.SEARCH_ROUTE_FORM];
    if (discoverFormCache && discoverFormCache.radius && discoverFormCache.units) {
      extraParams.radius = discoverFormCache.radius;
      extraParams.units = discoverFormCache.units;
    }

    console.log("Extra params:", extraParams);
    
    const response = await server.post(
      "/api/fetchincidents", 
      getState().maps.routes ? { routes: getState().maps.routes, extraParams } : null, 
      getState().auth.authenticated ? config : null
    );

    dispatch({ type: FETCH_INCIDENTS, payload: response.data });
    dispatch(updateToken(response));

    if (callback) callback();
    
  } catch(e) {
    console.log(e);
  }
}