import _ from "lodash";
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

    let extraParams = {};

    const discoverFormCache = getState().form[formNames.SEARCH_ROUTE_FORM];
    if (discoverFormCache && discoverFormCache.radius) {
      extraParams.radius = discoverFormCache.radius;
    }

    console.log("Extra params:", extraParams);

    let omittedKeys = ["useCurrentLocation", "radius"];

    const response = await server.post(
      "/api/fetchincidents", 
      discoverFormCache ? { 
        directionSearchParams: _.omit(discoverFormCache, omittedKeys), 
        ...extraParams.radius && { extraParams } 
      } : null, 
      getState().auth.authenticated ? config : null
    );

    dispatch({ type: FETCH_INCIDENTS, payload: response.data });
    dispatch(updateToken(response));

    if (callback) callback();
    
  } catch(e) {
    console.log(e);
  }
}