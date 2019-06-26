import { UPDATE_ACTIVE_DISCOVER } from "./types";
import server from "../api/server";
import { fetchDirections } from "./mapsActions";
import { fetchPlaces } from "./placesActions";
import { formCache } from "./formActions";
import { formNames } from "../utils";

export const processQuery = (query, callback=null, callbackError=null) => async (dispatch, getState) => {
  // given a query for wit ai, gets processed response from server and calls other relevant dispatches.
  try {

    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };
    
    const response = await server.post("/api/query", query, getState().auth.authenticated ? config : null);

    const { data } = response;
    if (data.error) {
      // error handling
      if (callbackError) callbackError(data.error);
      return;
    }

    // make sure to await dispatches!
    // also, process query controller does not send a refreshed token back in its field yet.

    const { queryType, queryParams } = data;

    const searchPropSchema = {
      altRoutes: false,
      avoidFerries: false,
      avoidHighways: false,
      avoidIndoor: false,
      avoidTolls: false,
      destination: "",
      mode: "driving", // in the future, let the user specify how they want to get there (on foot, public transport, bike, car)
      origin: "",
      units: "imperial",
      radius: null,
    }

    const searchPlacePropSchema = { 
      keyword: "", 
      address: "", 
      radius: "0", 
      units: "imperial",
      type: "",
      minprice: -1,
      maxprice: -1,
      currentLocation: query.currentLocation
    }

    if (queryType === "directions") {

      searchPropSchema.destination = queryParams.destination;
      searchPropSchema.origin = queryParams.origin;
      
      dispatch(formCache(formNames.SEARCH_ROUTE_FORM, searchPropSchema)); // update form
      await dispatch(fetchDirections(searchPropSchema)); // wait for directions to fetch
      
      dispatch({ type: UPDATE_ACTIVE_DISCOVER, payload: "directions" }); // update active discover panel
      
      if (callback) callback();

      return;

    } else if (queryType === "incidents") {
      
      searchPropSchema.destination = queryParams.destination;
      searchPropSchema.origin = queryParams.origin;
      searchPropSchema.units = queryParams.units || "imperial";
      searchPropSchema.radius = queryParams.radius;
        
      dispatch(formCache(formNames.SEARCH_ROUTE_FORM, searchPropSchema));
      await dispatch(fetchDirections(searchPropSchema));
      
      dispatch({ type: UPDATE_ACTIVE_DISCOVER, payload: "incidents" });
      
      if (callback) callback();

      return;

    } else if (queryType === "places") {
      // places must support lat lng pair objects.
      // intent place query returns this:
      /* 
      {
    "queryParams": {
        "radius": 15,
        "keyword": "99 Ranch",
        "units": "imperial"
    },
    "queryType": "places",
    "currentLocation": {
        "lat": 33.68453230000001,
        "lng": -117.8265414
    }
    }*/
      searchPlacePropSchema.keyword = queryParams.keyword;
      searchPlacePropSchema.units = queryParams.units;
      searchPlacePropSchema.radius = queryParams.radius;
      dispatch(formCache(formNames.SEARCH_PLACE_FORM, searchPlacePropSchema));

      await dispatch(fetchPlaces(searchPlacePropSchema));
      dispatch({ type: UPDATE_ACTIVE_DISCOVER, payload: "places" });
      
      if (callback) callback();

      return;
    }

    if (callback) callback();

  } catch(e) {
    console.log(e);
    const payload = e.response ? e.response.data.message : null;
    if (callbackError) callbackError(payload || "There was an error with the server.");
  }
}